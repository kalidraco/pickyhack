const assert = require('assert');
const { TaskTree } = require('../../src/agent/task-tree');

console.log('--- Testing TaskTree ---');

const tree = new TaskTree();

// 1. Add Root and Child Tasks
const reconRoot = tree.addTask({
  title: 'Network Reconnaissance',
  type: 'RECON',
  status: 'in_progress'
});
assert(reconRoot.id, 'Root task must have an ID');

const portScan = tree.addTask({
  title: 'Port Scan 192.168.1.1',
  type: 'SCAN',
  status: 'pending',
  parentId: reconRoot.id,
  tool: 'nmap'
});
assert.strictEqual(portScan.parentId, reconRoot.id);
console.log('✓ Hierarchical task insertion functions');

// 2. Query children & progress
const children = tree.getChildren(reconRoot.id);
assert.strictEqual(children.length, 1);
assert.strictEqual(children[0].id, portScan.id);

tree.updateTaskStatus(portScan.id, 'completed', { output: '22/tcp, 80/tcp open' });
const updatedPortScan = tree.getTask(portScan.id);
assert.strictEqual(updatedPortScan.status, 'completed');
assert(updatedPortScan.result.output.includes('22/tcp'));
console.log('✓ Task status updates and stores execution results');

// 3. Next Recommended Action (NRA)
const nra = tree.recommendNextAction();
assert(nra, 'Should recommend a next action based on current state');
console.log('✓ Next Recommended Action returned:', nra.action);

// 4. Serialization round-trip
const serialized = tree.toJSON();
const tree2 = new TaskTree();
tree2.fromJSON(serialized);
assert.strictEqual(tree2.tasks.length, tree.tasks.length);
assert.strictEqual(tree2.getTask(portScan.id).status, 'completed');
console.log('✓ Task tree serializes and deserializes accurately');

console.log('All TaskTree unit tests passed!\n');
