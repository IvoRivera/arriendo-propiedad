---
phase: 38
plan: 1
wave: 1
---

# Plan 38.1: Repository Hygiene & Git Cleanup

## Objective
Harden the repository by cleaning up unversioned files, securing `.gitignore`, and ensuring no sensitive data is leaked.

## Context
- .gitignore
- Git index
- Root directory

## Tasks

<task type="auto">
  <name>Hardening .gitignore</name>
  <files>.gitignore</files>
  <action>
    1. Update `.gitignore` to include all missing patterns mentioned in the request:
       - Next.js: .next/, out/
       - Dependencies: node_modules/
       - Env: .env, .env.local, .env.*.local
       - Logs: *.log, npm-debug.log*, etc.
       - OS: .DS_Store, Thumbs.db
       - Temp: tmp/, *.tmp
  </action>
  <verify>Check .gitignore content.</verify>
  <done>.gitignore is robust and covers all required cases.</done>
</task>

<task type="auto">
  <name>Clean Untracked Files from Index</name>
  <files>.gitignore</files>
  <action>
    1. Run `git rm -r --cached` for any directory that should be ignored but was previously tracked (e.g., .next, node_modules if any).
    2. Run `git rm --cached` for sensitive files like .env if tracked.
  </action>
  <verify>Run `git ls-files` on ignored patterns and expect zero results.</verify>
  <done>Git index is clean of ignored files.</done>
</task>

<task type="auto">
  <name>Security & Artifact Audit</name>
  <files>src/**/*</files>
  <action>
    1. Search for hardcoded secrets or tokens (Supabase keys, etc.) in the code.
    2. Identify and remove any local artifact files (*.sql, *.bak) that shouldn't be in the repo (except official migrations).
  </action>
  <verify>Run `grep` or `Select-String` for common secret patterns.</verify>
  <done>No sensitive data found in the repository.</done>
</task>

## Success Criteria
- [ ] `.gitignore` updated and hardened.
- [ ] No `.next`, `node_modules`, or `.env` files in git index.
- [ ] No exposed secrets in code.
- [ ] `git status` shows no unexpected untracked files.
