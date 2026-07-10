# Claude Skills for Code-club

This directory contains custom Claude skills that enhance Claude Code functionality for this project.

## Available Skills

- **code-review** — Review code changes for bugs, security, and best practices
- **test-locally** — Run tests and report coverage

## How Skills Work

Skills are markdown files with YAML frontmatter that define Claude behaviors. When you:

1. **Edit a skill locally** — changes take effect immediately in your Claude session
2. **Commit and push to GitHub** — your team gets the updated skills when they pull
3. **Run `/skill-name`** — Claude follows the instructions in that skill

## Creating a New Skill

1. Create a new folder in this directory:
   ```bash
   mkdir -p .claude/skills/my-new-skill
   ```

2. Create `SKILL.md` with this template:
   ```yaml
   ---
   name: my-new-skill
   description: What this skill does (shown in /slash menu)
   disable-model-invocation: true  # true = only you invoke, false = Claude can auto-use
   user-invocable: true            # true = shows in /slash menu
   ---

   ## Your Skill Title

   Instructions for Claude on what to do when this skill is invoked.

   ## Usage

   `/my-new-skill` - Description of what this does
   `/my-new-skill arg1` - Description with arguments
   ```

3. Test it locally:
   ```bash
   # In Claude, type:
   /my-new-skill
   ```

4. Commit and push:
   ```bash
   git add .claude/skills/
   git commit -m "Add my-new-skill"
   git push origin claude/skills-github-repo-f332pb
   ```

## Frontmatter Options

| Option | Purpose | Example |
|--------|---------|---------|
| `description` | When Claude should use the skill (shown in `/` menu) | `description: Deploy to production safely` |
| `disable-model-invocation` | If `true`, only you invoke (not Claude automatically) | `disable-model-invocation: true` |
| `user-invocable` | If `false`, only Claude invokes (background knowledge) | `user-invocable: true` |
| `allowed-tools` | Pre-approve specific tools | `allowed-tools: Bash(git *) Bash(npm *)` |
| `agent` | Use a specialized agent type | `agent: Plan` |

## Advanced: Reference Supporting Files

For complex skills, you can organize supporting files:

```
my-complex-skill/
├── SKILL.md
├── templates/
│   └── checklist.md
├── examples/
│   └── deployment-example.md
└── scripts/
    └── deploy.sh
```

In SKILL.md, reference them:
```md
See [deployment checklist](templates/checklist.md)
Or run: bash scripts/deploy.sh $ARGUMENTS
```

## Tips

✅ **Keep it focused** — one skill = one task  
✅ **Clear descriptions** — describe WHEN Claude should use it  
✅ **Test locally first** — make sure it works before pushing  
✅ **Use dynamic content** — reference files, scripts, git output  
✅ **Document with examples** — show how to invoke with args  

❌ **Don't store secrets** in skills — use env vars instead  
❌ **Don't make it too long** — move reference material to separate files  

## Testing Changes Locally

Live change detection means edits take effect immediately:

```bash
# 1. Edit a skill
vim .claude/skills/my-skill/SKILL.md

# 2. In Claude, the skill reflects your changes instantly
/my-skill

# 3. Once satisfied, commit and push
git commit -m "Update my-skill"
git push origin claude/skills-github-repo-f332bp
```

## Sharing with Your Team

Once you push to GitHub:

```bash
# Your teammates run:
git pull origin claude/skills-github-repo-f332pb

# They immediately have access to all skills
/code-review
/test-locally
```

No additional setup needed — skills load automatically! 🎉
