/**
 * PickyHack — Persistent Pentest Task Tree
 * Hierarchical execution graph maintaining mission objectives and subtasks.
 * Strictly external to ephemeral chat memory; survives model hot-swapping and new sessions.
 */
(function(root) {
  'use strict';

  class TaskTree {
    constructor(projectState = null) {
      this.projectState = projectState;
      this.localState = { tasks: [] };
    }

    get tasks() {
      return this.getTasks();
    }

    loadState(state) {
      if (state) this.localState = state;
    }

    getState() {
      if (this.projectState && typeof this.projectState.get === 'function') {
        return this.projectState.get();
      }
      return this.localState;
    }

    getTasks() {
      const state = this.getState();
      return state.tasks || [];
    }

    getTask(id) {
      return this.getTasks().find(t => t.id === id) || null;
    }

    getChildren(parentId) {
      return this.getTasks().filter(t => t.parentId === parentId);
    }

    addTask(taskData) {
      if (this.projectState && typeof this.projectState.addTask === 'function') {
        return this.projectState.addTask(taskData);
      }
      const task = {
        id: taskData.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: taskData.title || 'Untitled Task',
        type: taskData.type || taskData.phase || 'RECON',
        phase: taskData.phase || taskData.type || 'RECON',
        status: taskData.status || 'pending',
        priority: taskData.priority || 'MEDIUM',
        parentId: taskData.parentId || null,
        tool: taskData.tool || null,
        result: taskData.result || null,
        dependencies: Array.isArray(taskData.dependencies) ? taskData.dependencies : [],
        evidenceRefs: Array.isArray(taskData.evidenceRefs) ? taskData.evidenceRefs : [],
        findingRefs: Array.isArray(taskData.findingRefs) ? taskData.findingRefs : [],
        commands: Array.isArray(taskData.commands) ? taskData.commands : [],
        nextAction: taskData.nextAction || ''
      };
      const state = this.getState();
      if (!Array.isArray(state.tasks)) state.tasks = [];
      state.tasks.push(task);
      return task;
    }

    updateTask(id, updates) {
      if (this.projectState && typeof this.projectState.updateTask === 'function') {
        return this.projectState.updateTask(id, updates);
      }
      const tasks = this.getTasks();
      const t = tasks.find(item => item.id === id);
      if (t) {
        Object.assign(t, updates);
        return t;
      }
      return null;
    }

    updateTaskStatus(id, status, result = null) {
      const updates = { status };
      if (result) updates.result = result;
      return this.updateTask(id, updates);
    }

    getActiveTask() {
      const tasks = this.getTasks();
      return tasks.find(t => t.status === 'in_progress' || t.status === 'IN_PROGRESS')
        || tasks.find(t => t.status === 'pending' || t.status === 'TODO')
        || null;
    }

    /**
     * Recommends the next 3 to 5 logical actions based purely on Project State
     */
    getNextRecommendedActions() {
      const state = this.getState();
      const recommendations = [];

      const openFindings = (state.findings || []).filter(f => f.status === 'SUSPECTED' || f.status === 'VALIDATING');
      const assetsWithoutServices = (state.assets || []).filter(a => (!a.services || a.services.length === 0));
      const confirmedCriticals = (state.findings || []).filter(f => f.severity === 'Critical' && f.status === 'CONFIRMED');

      // 1. Validate suspected findings
      if (openFindings.length > 0) {
        const topFinding = openFindings[0];
        recommendations.push({
          action: `Validate ${topFinding.cve !== 'N/A' ? topFinding.cve : topFinding.title}`,
          why: 'Vulnerability is suspected but requires explicit reproduction evidence.',
          basedOn: `Finding: ${topFinding.title} (${topFinding.severity}) on ${topFinding.target}`,
          priority: 'CRITICAL'
        });
      }

      // 2. Exploit verified critical path
      if (confirmedCriticals.length > 0 && (!state.tasks || !state.tasks.some(t => t.phase === 'POST_EXPLOITATION' && t.status === 'DONE'))) {
        const crit = confirmedCriticals[0];
        recommendations.push({
          action: `Pivot & escalate access through verified ${crit.cve || crit.title}`,
          why: 'Perimeter compromised with confirmed RCE/root access.',
          basedOn: `Confirmed Finding: ${crit.title}`,
          priority: 'HIGH'
        });
      }

      // 3. Port scan undiscovered assets
      if (assetsWithoutServices.length > 0) {
        const targetAsset = assetsWithoutServices[0];
        recommendations.push({
          action: `Enumerate open ports on ${targetAsset.host || targetAsset.ip}`,
          why: 'Host discovered in scope but lacks service fingerprinting.',
          basedOn: `Asset: ${targetAsset.ip}`,
          priority: 'MEDIUM'
        });
      }

      // 4. Default reconnaissance if nothing defined
      if (recommendations.length === 0) {
        recommendations.push({
          action: `Perform initial reconnaissance and service discovery`,
          why: 'Target scope defined without active enumeration findings.',
          basedOn: `Scope: ${state.scope || state.target || 'In-scope targets'}`,
          priority: 'MEDIUM'
        });
      }

      return recommendations.slice(0, 5);
    }

    recommendNextAction() {
      const recs = this.getNextRecommendedActions();
      return recs.length > 0 ? recs[0] : null;
    }

    toJSON() {
      return JSON.stringify(this.getTasks());
    }

    fromJSON(json) {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      const state = this.getState();
      state.tasks = Array.isArray(parsed) ? parsed : (parsed.tasks || []);
      return state.tasks;
    }
  }

  const defaultTaskTree = new TaskTree();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TaskTree, defaultTaskTree };
  }
  root.PickyTaskTree = defaultTaskTree;
})(typeof window !== 'undefined' ? window : global);
