import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { useVersions, useLatestVersion } from "@docusaurus/plugin-content-docs/client";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import VersionsArchived from "@site/versionsArchived.json";

const docsPluginId = undefined;

const VersionsArchivedList = Object.entries(VersionsArchived);

function DocumentationLabel() {
  return <Translate id="versionsPage.versionEntry.link">Documentation</Translate>;
}

function ReleaseNotesLabel() {
  return <Translate id="versionsPage.versionEntry.releaseNotes">Release Notes</Translate>;
}

function splitVersion(input: string) {
  const index = input.indexOf('-');
  if (index !== -1) {
    return [input.substring(0, index), input.substring(index + 1)];
  } else {
    return [input];
  }
}

function versionAliases(version: string, fallbackName: string, organizationName: string, projectName: string, customFields: any) {
  const [versionPrefix, versionSuffix] = splitVersion(version);
  const alias = customFields.aliases?.[versionPrefix];
  const name = alias?.name || fallbackName;
  const repoUrl = `https://github.com/${organizationName}/${alias?.project || projectName}`;
  const tagUrl = versionSuffix ? `${repoUrl}/releases/tag/${versionSuffix}` : repoUrl;
  return { name, repoUrl, tagUrl };
}

export default function Version() {
  const { siteConfig: { organizationName, projectName, customFields } } = useDocusaurusContext();
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);
  const currentVersion = versions.find(version => version.name === "current");
  const pastVersions = versions.filter(version => version !== latestVersion && version.name !== "current");

  return (
    <Layout title="Versions" description="Core Versions page listing all documented site versions">
      <main className="container margin-vert--lg">
        <Heading as="h1"><Translate id="versionsPage.title">Core Blockchain Client versions</Translate></Heading>

        <div className="margin-bottom--lg">
          <Heading as="h3" id="next"><Translate id="versionsPage.current.title">Current version (Stable)</Translate></Heading>
          <p><Translate id="versionsPage.current.description">Here you can find the documentation for current released version.</Translate></p>
          <table>
            <tbody>
              <tr>
                <th>{latestVersion.label}</th>
                <th>{versionAliases(latestVersion.name, 'Current', organizationName, projectName, customFields).name}</th>
                <td>
                  <Link to={`${latestVersion.path}`}><DocumentationLabel /></Link>
                </td>
                <td>
                  <Link to={versionAliases(latestVersion.name, 'Current', organizationName, projectName, customFields).tagUrl}><ReleaseNotesLabel /></Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {currentVersion && currentVersion !== latestVersion && (
          <div className="margin-bottom--lg">
            <Heading as="h3" id="latest"><Translate id="versionsPage.next.title">Next version (Unreleased)</Translate></Heading>
            <p><Translate id="versionsPage.next.description">Here you can find the documentation for work-in-process unreleased version.</Translate></p>
            <table>
              <tbody>
                <tr>
                  <th>{currentVersion.label}</th>
                  <th>{versionAliases(currentVersion.name, 'WiP', organizationName, projectName, customFields).name}</th>
                  <td><Link to={`${currentVersion.path}`}><DocumentationLabel /></Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {(pastVersions.length > 0 || VersionsArchivedList.length > 0) && (
          <div className="margin-bottom--lg">
            <Heading as="h3" id="archive"><Translate id="versionsPage.archived.title">Past versions (Not maintained anymore)</Translate></Heading>
            <p><Translate id="versionsPage.archived.description">Here you can find documentation for previous versions of Core Clients.</Translate></p>
            <table>
              <tbody>
                {pastVersions.map(version => (
                  <tr key={version.name}>
                    <th>{version.label}</th>
                    <th>{versionAliases(version.name, 'Past', organizationName, projectName, customFields).name}</th>
                    <td><Link to={`${version.path}/intro`}><DocumentationLabel /></Link></td>
                    <td><Link to={versionAliases(version.name, 'Past', organizationName, projectName, customFields).tagUrl}><ReleaseNotesLabel /></Link></td>
                  </tr>
                ))}
                {VersionsArchivedList.map(([versionName, versionUrl]) => (
                  <tr key={versionName}>
                    <th>{versionName}</th>
                    <th>{versionAliases(versionName, 'Archived', organizationName, projectName, customFields).name}</th>
                    <td><Link to={versionUrl as string}><DocumentationLabel /></Link></td>
                    <td><Link to={versionAliases(versionName, 'Archived', organizationName, projectName, customFields).tagUrl}><ReleaseNotesLabel /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}
