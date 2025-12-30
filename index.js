// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const core = require('@actions/core');
const github = require('@actions/github');
const { subDays, parseISO, isBefore } = require('date-fns');

async function run() {
    try {
        const token = core.getInput('token');
        const daysOld = parseInt(core.getInput('days_old')) || 30;
        const dryRun = core.getInput('dry_run') === 'true';
        const ignoreBranchesInput = core.getInput('ignore_branches') || 'main,master';
        const ignoreBranches = ignoreBranchesInput.split(',').map(b => b.trim());

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        console.log(`Settings: >${daysOld} days old, DryRun: ${dryRun}`);
        console.log(`Ignoring: ${ignoreBranches.join(', ')}`);

        // Fetch branches
        const { data: branches } = await octokit.rest.repos.listBranches({
            owner,
            repo,
            per_page: 100
        });

        const thresholdDate = subDays(new Date(), daysOld);

        for (const branch of branches) {
            if (ignoreBranches.includes(branch.name)) {
                continue;
            }

            // Fetch last commit details
            const { data: commit } = await octokit.rest.repos.getCommit({
                owner,
                repo,
                ref: branch.commit.sha
            });

            const commitDate = parseISO(commit.commit.author.date);

            if (isBefore(commitDate, thresholdDate)) {
                console.log(`[STALE] Branch '${branch.name}' (Last Date: ${commit.commit.author.date})`);

                if (!dryRun) {
                    try {
                        await octokit.rest.git.deleteRef({
                            owner,
                            repo,
                            ref: `heads/${branch.name}`
                        });
                        console.log(`  -> Deleted '${branch.name}'`);
                    } catch (e) {
                        console.error(`  -> Failed to delete '${branch.name}': ${e.message}`);
                    }
                } else {
                    console.log(`  -> [Dry Run] Would delete '${branch.name}'`);
                }
            } else {
                // console.log(`[ACTIVE] Branch '${branch.name}'`);
            }
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel
