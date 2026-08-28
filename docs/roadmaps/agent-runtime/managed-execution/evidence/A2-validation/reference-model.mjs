#!/usr/bin/env node
/**
 * Validation-only proposal model. It proves self-consistency of proposed A2
 * policy scenarios, not implementation, delivery, product validity, or approval.
 */

const CODE = Object.freeze({
  invalidSelector: 'invalid-selector',
  candidateLimit: 'candidate-limit-exceeded',
  invalidDefinition: 'invalid-definition',
  authorityUnavailable: 'authority-unavailable',
  identityConflict: 'identity-conflict',
  selectorNotFound: 'selector-not-found',
  aliasNotFound: 'alias-not-found',
  overrideConflict: 'override-conflict',
  aliasAmbiguous: 'alias-ambiguous',
});
const SAFE_FALLBACK_CODE = 'resolution-failed';
const AGGREGATE_CODES = new Set([CODE.invalidDefinition, CODE.authorityUnavailable]);
const PUBLIC_CODES = new Set([...Object.values(CODE)]);
const sources = new Set(['project', 'global', 'package', 'builtin']);
const normalize = (name) => typeof name === 'string' ? name.trim().toLowerCase() : '';
const tupleKey = (id) => JSON.stringify([id.source, id.owner, id.normalizedName]);
const equalIdentity = (left, right) => left.source === right.source && left.owner === right.owner && left.normalizedName === right.normalizedName;
const sameIdentitySet = (left, right) => left.length === right.length && left.map(tupleKey).sort().every((key, index) => key === right.map(tupleKey).sort()[index]);

function internalSuccess(value) { return { ok: true, value }; }
function internalFailure(code, detail = {}) { return { ok: false, code, ...detail }; }
function identity(input) {
  const normalizedName = normalize(input?.name);
  if (!sources.has(input?.source) || !normalizedName) return internalFailure(CODE.invalidDefinition, { reason: 'identity' });
  const owned = input.source === 'package' || input.source === 'builtin';
  if (owned && (typeof input.owner !== 'string' || !input.owner.trim())) return internalFailure(CODE.invalidDefinition, { reason: 'identity' });
  if (!owned && input.owner != null) return internalFailure(CODE.invalidDefinition, { reason: 'identity' });
  return internalSuccess({ source: input.source, owner: owned ? input.owner.trim() : null, normalizedName });
}
function candidateSortTuple(def) {
  return JSON.stringify([
    typeof def?.source === 'string' ? def.source : null,
    typeof def?.owner === 'string' ? def.owner.trim() : null,
    normalize(def?.name) || null,
  ]);
}
function confirmsDiscovery(authority, id) {
  if (!authority || typeof authority.confirmsExactIdentity !== 'function') return false;
  try { return authority.confirmsExactIdentity({ ...id }) === true; } catch { return false; }
}
function authorizesTools(authority, tools) {
  if (!authority || typeof authority.acceptsEvery !== 'function') return false;
  try { return authority.acceptsEvery([...tools]) === true; } catch { return false; }
}
function authorizesModelEffort(authority, model, effort) {
  if (!authority || typeof authority.authorize !== 'function') return false;
  try { return authority.authorize(model, effort) === true; } catch { return false; }
}
function mayDeclareOverrides(authority, declarer, context, targets) {
  if (!authority || typeof authority.mayDeclareOverrides !== 'function') return false;
  try { return authority.mayDeclareOverrides({ ...declarer }, context, targets.map((target) => ({ ...target }))) === true; } catch { return false; }
}
function mayReadInternal(authority, context) {
  if (!authority || typeof authority.mayReadExactContext !== 'function') return false;
  try { return authority.mayReadExactContext(context) === true; } catch { return false; }
}
function selectorIdentity(selector) {
  if (!selector || typeof selector !== 'object' || Array.isArray(selector)) return null;
  const parsed = identity(selector);
  return parsed.ok ? parsed.value : null;
}
function validate(definition, context) {
  const parsed = identity(definition);
  if (!parsed.ok) return { ok: false, kind: 'definition', reason: parsed.reason, sort: `${candidateSortTuple(definition)}|identity` };
  const id = parsed.value;
  // Discovery owns provenance for every source kind; frontmatter cannot select it.
  if (!confirmsDiscovery(context.discoveryAuthority, id)) return { ok: false, kind: 'authority', reason: 'provenance', sort: `${tupleKey(id)}|provenance` };
  if (typeof definition.description !== 'string' || !definition.description.trim()) return { ok: false, kind: 'definition', reason: 'description', sort: `${tupleKey(id)}|description` };
  if (!Array.isArray(definition.tools)) return { ok: false, kind: 'definition', reason: 'tools', sort: `${tupleKey(id)}|tools` };
  if ((definition.model != null || definition.effort != null) && !authorizesModelEffort(context.modelEffortAuthority, definition.model, definition.effort)) {
    return { ok: false, kind: 'authority', reason: 'model-effort', sort: `${tupleKey(id)}|model-effort` };
  }
  if (definition.tools.length && !authorizesTools(context.toolAuthority, definition.tools)) return { ok: false, kind: 'authority', reason: 'tools', sort: `${tupleKey(id)}|tools` };
  return { ok: true, value: { ...id, def: definition } };
}
function aggregateValidation(failures) {
  const ordered = failures.slice().sort((left, right) => {
    if (left.sort !== right.sort) return left.sort < right.sort ? -1 : 1;
    if (left.reason !== right.reason) return left.reason < right.reason ? -1 : 1;
    return 0;
  });
  const counts = Object.freeze({
    authority: ordered.filter((failure) => failure.kind === 'authority').length,
    invalidDefinition: ordered.filter((failure) => failure.kind === 'definition').length,
  });
  return internalFailure(counts.authority ? CODE.authorityUnavailable : CODE.invalidDefinition, {
    counts,
    internalFailures: ordered.map(({ kind, reason, sort }) => ({ kind, reason, sort })),
  });
}
function safePublicResult(core) {
  if (core.ok) return Object.freeze({ ok: true, status: 'resolved' });
  const code = PUBLIC_CODES.has(core.code) ? core.code : SAFE_FALLBACK_CODE;
  const output = { ok: false, status: 'failed', code };
  if (AGGREGATE_CODES.has(code) && core.counts && Number.isInteger(core.counts.authority) && Number.isInteger(core.counts.invalidDefinition)) {
    output.counts = { authority: core.counts.authority, invalidDefinition: core.counts.invalidDefinition };
  }
  return Object.freeze(output);
}
function resolveCore(input) {
  if (!input.managed) return internalSuccess(input.legacyResult);
  if (typeof input.selector === 'string') {
    if (!normalize(input.selector)) return internalFailure(CODE.invalidSelector);
  } else if (!selectorIdentity(input.selector)) {
    return internalFailure(CODE.invalidSelector);
  }
  const limit = input.limit ?? Infinity;
  if (!Array.isArray(input.definitions) || input.definitions.length > limit) return internalFailure(CODE.candidateLimit);
  const validated = input.definitions.map((definition) => validate(definition, input));
  const failures = validated.filter((result) => !result.ok);
  if (failures.length) return aggregateValidation(failures);
  const candidates = validated.map((result) => result.value);
  const duplicate = candidates.some((candidate, index) => candidates.slice(0, index).some((prior) => equalIdentity(prior, candidate)));
  if (duplicate) return internalFailure(CODE.identityConflict);
  if (typeof input.selector === 'object') {
    const target = selectorIdentity(input.selector);
    const found = candidates.find((candidate) => equalIdentity(candidate, target));
    return found ? internalSuccess(found) : internalFailure(CODE.selectorNotFound);
  }
  const contenders = candidates.filter((candidate) => candidate.normalizedName === normalize(input.selector));
  if (!contenders.length) return internalFailure(CODE.aliasNotFound);
  const declarations = contenders.filter((candidate) => candidate.def.overrides != null);
  if (!declarations.length) return contenders.length === 1 ? internalSuccess(contenders[0]) : internalFailure(CODE.aliasAmbiguous);
  const authorized = [];
  for (const candidate of declarations) {
    const overrides = candidate.def.overrides;
    if (!['project', 'global'].includes(candidate.source) || !Array.isArray(overrides) || !overrides.length) return internalFailure(CODE.overrideConflict);
    const targets = overrides.map(selectorIdentity);
    if (targets.some((target) => !target)) return internalFailure(CODE.overrideConflict);
    const others = contenders.filter((other) => !equalIdentity(other, candidate));
    if (!sameIdentitySet(targets, others) || !mayDeclareOverrides(input.overrideAuthority, candidate, input.context, targets)) return internalFailure(CODE.overrideConflict);
    authorized.push(candidate);
  }
  return authorized.length === 1 ? internalSuccess(authorized[0]) : internalFailure(CODE.overrideConflict);
}
// The only full-result entry point: the authority is literal and context-bound.
function resolveInternal(input, internalReadAuthority, context) {
  if (context !== input.context || !mayReadInternal(internalReadAuthority, context)) return Object.freeze({ ok: false, status: 'denied' });
  return resolveCore(input);
}
// The only public entry point: it never returns the private core result.
function resolvePublic(input) { return safePublicResult(resolveCore(input)); }

// Independently authored discovery tuples. They are not computed from candidates.
const DEFAULT_CONTEXT = 'a2/validation/default';
const S11_CONTEXT = 'a2/validation/S11';
const DISCOVERY_TUPLES = Object.freeze([
  { source: 'project', owner: null, normalizedName: 'build' },
  { source: 'global', owner: null, normalizedName: 'build' },
  { source: 'package', owner: 'vendor/pkg', normalizedName: 'build' },
  { source: 'package', owner: 'vendor', normalizedName: 'pkg/build' },
  { source: 'builtin', owner: 'core', normalizedName: 'build' },
]);
function literalDiscoveryAuthority(records) {
  const accepted = new Set(records.map(tupleKey));
  return Object.freeze({ confirmsExactIdentity: (id) => accepted.has(tupleKey(id)) });
}
const DISCOVERY_AUTHORITY = literalDiscoveryAuthority(DISCOVERY_TUPLES);
const PACKAGE_ONLY_DISCOVERY = literalDiscoveryAuthority(Object.freeze([
  { source: 'package', owner: 'vendor/pkg', normalizedName: 'build' },
]));
const BUILTIN_ONLY_DISCOVERY = literalDiscoveryAuthority(Object.freeze([
  { source: 'builtin', owner: 'core', normalizedName: 'build' },
]));
const FORGED_DISCOVERY = literalDiscoveryAuthority(Object.freeze([
  { source: 'package', owner: 'other', normalizedName: 'build' },
]));
const S11_OVERRIDE_RECORD = Object.freeze({
  declarer: { source: 'project', owner: null, normalizedName: 'build' },
  context: S11_CONTEXT,
  targets: [{ source: 'global', owner: null, normalizedName: 'build' }],
});
function literalOverrideAuthority(records) {
  return Object.freeze({
    mayDeclareOverrides: (declarer, context, targets) => records.some((record) =>
      record.context === context && equalIdentity(record.declarer, declarer) && sameIdentitySet(record.targets, targets)),
  });
}
const S11_OVERRIDE_AUTHORITY = literalOverrideAuthority(Object.freeze([S11_OVERRIDE_RECORD]));
const INTERNAL_READ_AUTHORITY = Object.freeze({ mayReadExactContext: (context) => context === DEFAULT_CONTEXT || context === S11_CONTEXT });
const externalModelEffortAuthority = Object.freeze({ authorize: (model, effort) => model === 'm' && effort === 'high' });
const externalToolAuthority = Object.freeze({ acceptsEvery: (tools) => tools.every((tool) => tool === 'read') });
const base = (source, name = 'Build', extra = {}) => ({ source, name, description: 'fixture description', tools: [], ...extra });
const pkg = (owner = 'vendor/pkg', extra = {}) => base('package', 'Build', { owner, ...extra });
const builtin = (owner = 'core', extra = {}) => base('builtin', 'Build', { owner, ...extra });
const exact = (source, owner, name = 'Build') => owner == null ? ({ source, name }) : ({ source, owner, name });
const normalAuthority = Object.freeze({ context: DEFAULT_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY });
function expect(name, result, code) {
  if (code == null ? !result.ok : result.ok || result.code !== code) throw new Error(`${name} failed: ${JSON.stringify(result)}`);
}
function expectIdentity(name, result, expected) {
  expect(name, result, null);
  const actual = result.value;
  if (!equalIdentity(actual, expected) || Object.keys(actual).join(',') !== 'source,owner,normalizedName') throw new Error(`${name} returned wrong identity`);
}
function expectCandidateIdentity(name, result, expected) {
  expect(name, result, null);
  if (!equalIdentity(result.value, expected)) throw new Error(`${name} returned wrong identity`);
}
function expectExactKeys(name, value, keys) {
  if (Object.keys(value).sort().join(',') !== keys.slice().sort().join(',')) throw new Error(`${name} exposed unexpected keys: ${JSON.stringify(value)}`);
}
function publicResolved(input) { return resolvePublic(input); }
function internalResolved(input, context = input.context) { return resolveInternal(input, INTERNAL_READ_AUTHORITY, context); }

const S01 = () => { if (normalize('  Build  ') !== 'build') throw new Error('S01 failed'); };
const S02 = () => expectIdentity('S02', identity(base('project')), { source: 'project', owner: null, normalizedName: 'build' });
const S03 = () => expectIdentity('S03', identity(base('global')), { source: 'global', owner: null, normalizedName: 'build' });
const S04 = () => {
  const accepted = publicResolved({ managed: true, selector: 'build', definitions: [pkg()], context: DEFAULT_CONTEXT, discoveryAuthority: PACKAGE_ONLY_DISCOVERY });
  expect('S04-trusted', accepted, null);
  expect('S04-missing-provenance', publicResolved({ managed: true, selector: 'build', definitions: [pkg()], context: DEFAULT_CONTEXT }), CODE.authorityUnavailable);
  expect('S04-forged-provenance', publicResolved({ managed: true, selector: 'build', definitions: [pkg()], context: DEFAULT_CONTEXT, discoveryAuthority: FORGED_DISCOVERY }), CODE.authorityUnavailable);
  expect('S04-source-mutation', publicResolved({ managed: true, selector: 'build', definitions: [base('global')], context: DEFAULT_CONTEXT, discoveryAuthority: PACKAGE_ONLY_DISCOVERY }), CODE.authorityUnavailable);
  expect('S04-owner-mutation', publicResolved({ managed: true, selector: 'build', definitions: [pkg('other')], context: DEFAULT_CONTEXT, discoveryAuthority: PACKAGE_ONLY_DISCOVERY }), CODE.authorityUnavailable);
  expect('S04-name-mutation', publicResolved({ managed: true, selector: 'other', definitions: [pkg('vendor/pkg', { name: 'Other' })], context: DEFAULT_CONTEXT, discoveryAuthority: PACKAGE_ONLY_DISCOVERY }), CODE.authorityUnavailable);
};
const S05 = () => {
  expect('S05-trusted', publicResolved({ managed: true, selector: 'build', definitions: [builtin()], context: DEFAULT_CONTEXT, discoveryAuthority: BUILTIN_ONLY_DISCOVERY }), null);
  expect('S05-missing-provenance', publicResolved({ managed: true, selector: 'build', definitions: [builtin()], context: DEFAULT_CONTEXT }), CODE.authorityUnavailable);
  expect('S05-forged-provenance', publicResolved({ managed: true, selector: 'build', definitions: [builtin()], context: DEFAULT_CONTEXT, discoveryAuthority: FORGED_DISCOVERY }), CODE.authorityUnavailable);
  expect('S05-source-mutation', publicResolved({ managed: true, selector: 'build', definitions: [base('project')], context: DEFAULT_CONTEXT, discoveryAuthority: BUILTIN_ONLY_DISCOVERY }), CODE.authorityUnavailable);
  expect('S05-owner-mutation', publicResolved({ managed: true, selector: 'build', definitions: [builtin('other')], context: DEFAULT_CONTEXT, discoveryAuthority: BUILTIN_ONLY_DISCOVERY }), CODE.authorityUnavailable);
  expect('S05-name-mutation', publicResolved({ managed: true, selector: 'other', definitions: [builtin('core', { name: 'Other' })], context: DEFAULT_CONTEXT, discoveryAuthority: BUILTIN_ONLY_DISCOVERY }), CODE.authorityUnavailable);
};
const S06 = () => {
  const input = { managed: true, selector: exact('package', 'vendor/pkg'), definitions: [base('project'), pkg(), builtin()], ...normalAuthority };
  expectCandidateIdentity('S06-exact', internalResolved(input), { source: 'package', owner: 'vendor/pkg', normalizedName: 'build' });
  expect('S06-missing-exact', publicResolved({ ...input, selector: exact('package', 'missing') }), CODE.selectorNotFound);
};
const S07 = () => {
  expect('S07-alias', publicResolved({ managed: true, selector: 'build', definitions: [base('project')], ...normalAuthority }), null);
  const slashDistinct = [pkg('vendor/pkg'), pkg('vendor', { name: 'pkg/build' })];
  expectCandidateIdentity('S07-slash-tuples', internalResolved({ managed: true, selector: exact('package', 'vendor', 'pkg/build'), definitions: slashDistinct, ...normalAuthority }), { source: 'package', owner: 'vendor', normalizedName: 'pkg/build' });
  expect('S07-duplicate', publicResolved({ managed: true, selector: 'build', definitions: [pkg(), pkg()], ...normalAuthority }), CODE.identityConflict);
};
const S08 = () => expect('S08', publicResolved({ managed: true, selector: 'build', definitions: [base('global')], ...normalAuthority }), null);
const S09 = () => expect('S09', publicResolved({ managed: true, selector: 'build', definitions: [base('project'), base('global')], ...normalAuthority }), CODE.aliasAmbiguous);
const S10 = () => expect('S10', publicResolved({ managed: true, selector: 'build', definitions: [base('project'), base('project')], ...normalAuthority }), CODE.identityConflict);
const S11 = () => {
  const project = base('project', 'Build', { overrides: [exact('global')] });
  const result = internalResolved({ managed: true, selector: 'build', definitions: [project, base('global')], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: S11_OVERRIDE_AUTHORITY });
  expectCandidateIdentity('S11', result, { source: 'project', owner: null, normalizedName: 'build' });
};
const S12 = () => {
  const project = base('project', 'Build', { overrides: [exact('global')] });
  const global = base('global');
  expect('S12-no-authority', publicResolved({ managed: true, selector: 'build', definitions: [project, global], ...normalAuthority }), CODE.overrideConflict);
  const changedDeclarer = base('global', 'Build', { overrides: [exact('project')] });
  expect('S12-changed-declarer', publicResolved({ managed: true, selector: 'build', definitions: [changedDeclarer, base('project')], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: S11_OVERRIDE_AUTHORITY }), CODE.overrideConflict);
  const changedTargets = base('project', 'Build', { overrides: [exact('global'), exact('package', 'vendor/pkg')] });
  expect('S12-changed-targets', publicResolved({ managed: true, selector: 'build', definitions: [changedTargets, global, pkg()], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: S11_OVERRIDE_AUTHORITY }), CODE.overrideConflict);
  expect('S12-changed-context', publicResolved({ managed: true, selector: 'build', definitions: [project, global], ...normalAuthority, overrideAuthority: S11_OVERRIDE_AUTHORITY }), CODE.overrideConflict);
};
const S13 = () => {
  const project = base('project', 'Build', { overrides: [exact('global')] });
  const global = base('global', 'Build', { overrides: [exact('project')] });
  expect('S13', publicResolved({ managed: true, selector: 'build', definitions: [project, global], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: literalOverrideAuthority(Object.freeze([
    S11_OVERRIDE_RECORD,
    { declarer: { source: 'global', owner: null, normalizedName: 'build' }, context: S11_CONTEXT, targets: [{ source: 'project', owner: null, normalizedName: 'build' }] },
  ])) }), CODE.overrideConflict);
};
const S14 = () => {
  const project = base('project', 'Build', { overrides: 'global,null,build' });
  expect('S14', publicResolved({ managed: true, selector: 'build', definitions: [project, base('global')], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: S11_OVERRIDE_AUTHORITY }), CODE.overrideConflict);
};
const S15 = () => {
  const packageDefinition = pkg('vendor/pkg', { overrides: [exact('global')] });
  expect('S15', publicResolved({ managed: true, selector: 'build', definitions: [packageDefinition, base('global')], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: literalOverrideAuthority(Object.freeze([
    { declarer: { source: 'package', owner: 'vendor/pkg', normalizedName: 'build' }, context: S11_CONTEXT, targets: [{ source: 'global', owner: null, normalizedName: 'build' }] },
  ])) }), CODE.overrideConflict);
};
const S16 = () => {
  const definition = base('project');
  const input = { managed: true, selector: 'build', definitions: [definition], ...normalAuthority };
  const internal = internalResolved(input);
  expectCandidateIdentity('S16-authorized-internal', internal, { source: 'project', owner: null, normalizedName: 'build' });
  if (internal.value.def !== definition) throw new Error('S16 authorized internal did not retain full candidate');
  const denied = resolveInternal(input, undefined, DEFAULT_CONTEXT);
  if (JSON.stringify(denied) !== JSON.stringify({ ok: false, status: 'denied' })) throw new Error('S16 unauthorized internal access leaked details');
  const success = publicResolved(input);
  if (JSON.stringify(success) !== JSON.stringify({ ok: true, status: 'resolved' })) throw new Error('S16 public success changed');
  expectExactKeys('S16-public-success', success, ['ok', 'status']);
  if (JSON.stringify(success).match(/fixture|project|value|identity|metadata|path/)) throw new Error('S16 public success leaked private data');
  const missingTools = base('project'); delete missingTools.tools;
  const aggregate = publicResolved({ managed: true, selector: 'build', definitions: [missingTools, base('global', 'Build', { description: '' })], ...normalAuthority, summary: 'injected', counts: { arbitrary: 99 }, reason: 'injected', path: '/private' });
  expect('S16-public-aggregate', aggregate, CODE.invalidDefinition);
  const deniedAggregate = resolveInternal({ managed: true, selector: 'build', definitions: [missingTools, base('global', 'Build', { description: '' })], ...normalAuthority }, undefined, DEFAULT_CONTEXT);
  if (JSON.stringify(deniedAggregate) !== JSON.stringify({ ok: false, status: 'denied' })) throw new Error('S16 unauthorized aggregate access leaked details');
  expectExactKeys('S16-public-aggregate', aggregate, ['ok', 'status', 'code', 'counts']);
  expectExactKeys('S16-public-aggregate-counts', aggregate.counts, ['authority', 'invalidDefinition']);
  if (JSON.stringify(aggregate).match(/injected|private|reason|sort|internalFailures|tuple|path|arbitrary/)) throw new Error('S16 public aggregate leaked private data');
  const unknown = safePublicResult(internalFailure('private-code', { summary: 'nonpublic-detail', counts: { authority: 7, invalidDefinition: 2, extra: 1 } }));
  if (JSON.stringify(unknown) !== JSON.stringify({ ok: false, status: 'failed', code: SAFE_FALLBACK_CODE })) throw new Error('S16 unknown code was forwarded');
};
const S17 = () => expect('S17', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { model: 'm' })], ...normalAuthority }), CODE.authorityUnavailable);
const S18 = () => {
  expect('S18-authorized', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { model: 'm', effort: 'high' })], ...normalAuthority, modelEffortAuthority: externalModelEffortAuthority }), null);
  expect('S18-unauthorized', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { model: 'm', effort: 'low' })], ...normalAuthority, modelEffortAuthority: externalModelEffortAuthority }), CODE.authorityUnavailable);
};
const S19 = () => expect('S19', publicResolved({ managed: true, selector: 'build', definitions: [base('project'), base('global')], limit: 1, ...normalAuthority }), CODE.candidateLimit);
const S20 = () => {
  const result = internalResolved({ managed: false, legacyResult: 'legacy-picked', selector: 'build', definitions: [], ...normalAuthority });
  if (!result.ok || result.value !== 'legacy-picked') throw new Error('S20 default-off changed unmanaged result');
};
const S21 = () => expect('S21', publicResolved({ managed: true, legacyResult: 'legacy-picked', selector: 'build', definitions: [base('project'), base('global')], ...normalAuthority }), CODE.aliasAmbiguous);
const S22 = () => expect('S22', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { description: '' })], ...normalAuthority }), CODE.invalidDefinition);
const S23 = () => {
  const missingTools = base('project'); delete missingTools.tools;
  const missingDescription = base('global', 'Build', { description: '' });
  const forwardInput = { managed: true, selector: 'build', definitions: [missingTools, missingDescription], ...normalAuthority };
  const reverseInput = { managed: true, selector: 'build', definitions: [missingDescription, missingTools], ...normalAuthority };
  const forward = publicResolved(forwardInput);
  const reversed = publicResolved(reverseInput);
  expect('S23-forward', forward, CODE.invalidDefinition);
  expect('S23-reversed', reversed, CODE.invalidDefinition);
  if (JSON.stringify(forward) !== JSON.stringify(reversed)) throw new Error('S23 public aggregate depends on input order');
  const internalForward = internalResolved(forwardInput);
  const internalReversed = internalResolved(reverseInput);
  if (JSON.stringify(internalForward.internalFailures) !== JSON.stringify(internalReversed.internalFailures)) throw new Error('S23 internal ordering is not deterministic');
};
const S24 = () => expect('S24', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { tools: [] })], ...normalAuthority }), null);
const S25 = () => expect('S25', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { tools: ['read'] })], ...normalAuthority }), CODE.authorityUnavailable);
const S26 = () => expect('S26', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { tools: ['read'] })], ...normalAuthority, toolAuthority: externalToolAuthority }), null);
const S27 = () => {
  const project = base('project', 'Build', { overrides: [exact('global')] });
  expect('S27', publicResolved({ managed: true, selector: 'build', definitions: [project], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: S11_OVERRIDE_AUTHORITY }), CODE.overrideConflict);
};
const S28 = () => {
  expect('S28-empty', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { tools: [] })], ...normalAuthority }), null);
  expect('S28-nonempty', publicResolved({ managed: true, selector: 'build', definitions: [base('project', 'Build', { tools: ['read'] })], ...normalAuthority }), CODE.authorityUnavailable);
};
const S29 = () => {
  const project = base('project', 'Build', { overrides: [exact('global')] });
  const result = internalResolved({ managed: true, selector: exact('global'), definitions: [project, base('global')], context: S11_CONTEXT, discoveryAuthority: DISCOVERY_AUTHORITY, overrideAuthority: S11_OVERRIDE_AUTHORITY });
  expectCandidateIdentity('S29', result, { source: 'global', owner: null, normalizedName: 'build' });
};
const scenarios = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29];
for (const scenario of scenarios) scenario();
console.log(`${scenarios.length}/29 proposal self-consistency assertions passed`);
