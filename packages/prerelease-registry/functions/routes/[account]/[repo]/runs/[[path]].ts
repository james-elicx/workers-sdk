import { getArtifactForWorkflowRun } from "../../../../utils/getArtifactForWorkflowRun";
import { generateGitHubFetch } from "../../../../utils/gitHubFetch";
import { repos } from "../../../../utils/repoAllowlist";

export const onRequestGet: PagesFunction<
	{ GITHUB_API_TOKEN: string; GITHUB_USER: string },
	"account" | "repo" | "path"
> = async ({ params, env, waitUntil }) => {
	const { account, repo, path } = params;

	if (
		!Array.isArray(path) ||
		!repos.find(([a, r]) => a === account && r === repo)
	) {
		console.log(account, repo, path);
		return new Response(null, { status: 404 });
	}

	const runID = parseInt(path[0]);
	const name = path[1];
	if (isNaN(runID) || name === undefined) {
		console.log(runID, name);
		return new Response(null, { status: 404 });
	}

	const gitHubFetch = generateGitHubFetch(env);

	return getArtifactForWorkflowRun({
		repo: repo as string,
		account: account as string,
		runID,
		name,
		gitHubFetch,
		waitUntil,
	});
};
