const assert = require('assert');
const { AgentLoop } = require('../../src/agent/agent-loop');
const ProjectState = require('../../src/core/project-state');

console.log('--- Testing AgentLoop Integration ---');

(async function run() {
  ProjectState.init();
  ProjectState.createProject({ id: 'loop-test-proj', name: 'Loop Test' });
  ProjectState.setTarget('198.51.100.10');
  ProjectState.setScope('198.51.100.0/24');

  const events = [];
  const loop = new AgentLoop({
    maxIterations: 3,
    onEvent: (ev) => {
      events.push(ev);
    }
  });

  const res = await loop.run('Perform initial enumeration on target 198.51.100.10');

  assert(res, 'Loop result must be defined');
  assert(res.iterationsCompleted >= 1, 'Should complete at least 1 iteration');
  console.log(`✓ AgentLoop completed ${res.iterationsCompleted} iterations`);

  // Verify events dispatched
  assert(events.length > 0, 'Should dispatch execution events');
  const eventTypes = events.map(e => e.type);
  assert(eventTypes.includes('STEP_START') || eventTypes.includes('COMPLETED'), 'Dispatches phase events');
  console.log('✓ Dispatched lifecycle events:', [...new Set(eventTypes)].join(', '));

  console.log('All AgentLoop integration tests passed!\n');
})();
