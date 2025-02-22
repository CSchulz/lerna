import {
  ProjectGraphProjectNodeWithPackage,
  ProjectGraphWorkspacePackageDependency,
} from "./project-graph-with-packages";
import { createProjectGraph, projectGraphDependency, projectNode } from "./test-helpers/create-project-graph";
import { toposortProjects } from "./toposort-projects";

describe("toposortProjects", () => {
  it("should order projects by depth of the tree with leaves first", () => {
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      // the order of this array is by root path
      // this simulates Object.values(...) on projectGraph.nodes
      // see ./command/create-project-graph-with-packages for details
      projectNode({
        name: "ppp2",
        type: "lib",
        data: {
          root: "packages-other/eee2",
        },
      }),
      projectNode({
        name: "ooo1",
        type: "lib",
        data: {
          root: "packages-other/ooo1",
        },
      }),
      projectNode({
        name: "ooo2",
        type: "lib",
        data: {
          root: "packages-other/ooo2",
        },
      }),
      projectNode({
        name: "other-1",
        type: "lib",
        data: {
          root: "packages/other-1",
        },
      }),
      projectNode({
        name: "other-2",
        type: "lib",
        data: {
          root: "packages/other-2",
        },
      }),
      projectNode({
        name: "other-with-scope",
        type: "lib",
        data: {
          root: "packages/other-with-scope",
        },
      }),
      projectNode({
        name: "package-1",
        type: "lib",
        data: {
          root: "packages/package-1",
        },
      }),
      projectNode({
        name: "package-2",
        type: "lib",
        data: {
          root: "packages/package-2",
        },
      }),
      projectNode({
        name: "package-base",
        type: "lib",
        data: {
          root: "packages/package-base",
        },
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "other-1",
        target: "other-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-base",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "package-base",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "ooo1",
        target: "ooo2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "ooo1",
        target: "ppp2",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    expect(toposortProjects(projects, projectGraph).map((p) => p.name)).toEqual([
      "ppp2",
      "ooo2",
      "other-2",
      "other-with-scope",
      "package-base",
      "ooo1",
      "other-1",
      "package-2",
      "package-1",
    ]);
  });

  it("should order projects by depth of the tree with leaves first, ignoring dependencies of projects that are not provided", () => {
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      // the order of this array is by root path
      // this simulates Object.values(...) on projectGraph.nodes
      // see ./command/create-project-graph-with-packages for details
      projectNode({
        name: "package-1",
        type: "lib",
        data: {
          root: "packages/package-1",
        },
      }),
      projectNode({
        name: "package-2",
        type: "lib",
        data: {
          root: "packages/package-2",
        },
      }),
      projectNode({
        name: "package-3",
        type: "lib",
        data: {
          root: "packages/package-3",
        },
      }),
      projectNode({
        name: "package-4",
        type: "lib",
        data: {
          root: "packages/package-4",
        },
      }),
      projectNode({
        name: "package-5",
        type: "lib",
        data: {
          root: "packages/package-5",
        },
      }),
      projectNode({
        name: "package-6",
        type: "lib",
        data: {
          root: "packages/package-6",
        },
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "package-1",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "package-3",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-3",
        target: "package-4",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-4",
        target: "package-5",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-5",
        target: "package-6",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    const projectsToOrder = [
      projectGraph.nodes["package-2"],
      projectGraph.nodes["package-3"],
      projectGraph.nodes["package-4"],
    ];

    expect(toposortProjects(projectsToOrder, projectGraph).map((p) => p.name)).toEqual([
      "package-4",
      "package-3",
      "package-2",
    ]);
  });

  it("should order projects by depth of the tree with leaves first, ignoring and skipping dependencies of projects that are not provided", () => {
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      // the order of this array is by root path
      // this simulates Object.values(...) on projectGraph.nodes
      // see ./command/create-project-graph-with-packages for details
      projectNode({
        name: "package-1",
        type: "lib",
        data: {
          root: "packages/package-1",
        },
      }),
      projectNode({
        name: "package-2",
        type: "lib",
        data: {
          root: "packages/package-2",
        },
      }),
      projectNode({
        name: "package-3",
        type: "lib",
        data: {
          root: "packages/package-3",
        },
      }),
      projectNode({
        name: "package-4",
        type: "lib",
        data: {
          root: "packages/package-4",
        },
      }),
      projectNode({
        name: "package-5",
        type: "lib",
        data: {
          root: "packages/package-5",
        },
      }),
      projectNode({
        name: "package-6",
        type: "lib",
        data: {
          root: "packages/package-6",
        },
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "package-1",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "package-3",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-3",
        target: "package-4",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-4",
        target: "package-5",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-5",
        target: "package-6",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    const projectsToOrder = [projectGraph.nodes["package-2"], projectGraph.nodes["package-4"]];

    // lerna does not recognize the dependency chain of package-2 -> package-3 -> package-4
    // because package-3 is not in the set of projects to order.
    expect(toposortProjects(projectsToOrder, projectGraph).map((p) => p.name)).toEqual([
      "package-2",
      "package-4",
    ]);
  });

  it("should handle cycles", () => {
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      // the order of this array is by root path
      // this simulates Object.values(...) on projectGraph.nodes
      // see ./command/create-project-graph-with-packages for details
      projectNode({
        name: "ppp2",
        type: "lib",
        data: {
          root: "packages-other/eee2",
        },
      }),
      projectNode({
        name: "ooo1",
        type: "lib",
        data: {
          root: "packages-other/ooo1",
        },
      }),
      projectNode({
        name: "ooo2",
        type: "lib",
        data: {
          root: "packages-other/ooo2",
        },
      }),
      projectNode({
        name: "cycle-1",
        type: "lib",
        data: {
          root: "packages/cycle-1",
        },
      }),
      projectNode({
        name: "cycle-2",
        type: "lib",
        data: {
          root: "packages/cycle-2",
        },
      }),
      projectNode({
        name: "other-1",
        type: "lib",
        data: {
          root: "packages/other-1",
        },
      }),
      projectNode({
        name: "other-2",
        type: "lib",
        data: {
          root: "packages/other-2",
        },
      }),
      projectNode({
        name: "other-with-scope",
        type: "lib",
        data: {
          root: "packages/other-with-scope",
        },
      }),
      projectNode({
        name: "package-1",
        type: "lib",
        data: {
          root: "packages/package-1",
        },
      }),
      projectNode({
        name: "package-2",
        type: "lib",
        data: {
          root: "packages/package-2",
        },
      }),
      projectNode({
        name: "package-base",
        type: "lib",
        data: {
          root: "packages/package-base",
        },
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "cycle-1",
        target: "cycle-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "cycle-2",
        target: "cycle-1",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "other-1",
        target: "other-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-base",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "package-base",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "cycle-1",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "ooo1",
        target: "ooo2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "ooo1",
        target: "ppp2",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    expect(toposortProjects(projects, projectGraph).map((p) => p.name)).toEqual([
      "ppp2",
      "ooo2",
      "other-2",
      "other-with-scope",
      "package-base",
      "ooo1",
      "other-1",
      "cycle-1",
      "cycle-2",
      "package-2",
      "package-1",
    ]);
  });

  it("should handle nested cycles", () => {
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      // the order of this array is by root path
      // this simulates Object.values(...) on projectGraph.nodes
      // see ./command/create-project-graph-with-packages for details
      projectNode({
        name: "package-1",
        type: "lib",
        data: {
          root: "packages/package-1",
        },
      }),
      projectNode({
        name: "package-2",
        type: "lib",
        data: {
          root: "packages/package-2",
        },
      }),
      projectNode({
        name: "package-3",
        type: "lib",
        data: {
          root: "packages/package-3",
        },
      }),
      projectNode({
        name: "package-4",
        type: "lib",
        data: {
          root: "packages/package-4",
        },
      }),
      projectNode({
        name: "package-5",
        type: "lib",
        data: {
          root: "packages/package-5",
        },
      }),
      projectNode({
        name: "package-6",
        type: "lib",
        data: {
          root: "packages/package-6",
        },
      }),
      projectNode({
        name: "package-7",
        type: "lib",
        data: {
          root: "packages/package-7",
        },
      }),
      projectNode({
        name: "package-8",
        type: "lib",
        data: {
          root: "packages/package-8",
        },
      }),
      projectNode({
        name: "package-9",
        type: "lib",
        data: {
          root: "packages/package-9",
        },
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "package-1",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-7",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "package-3",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-3",
        target: "package-4",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-3",
        target: "package-5",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-4",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-5",
        target: "package-6",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-6",
        target: "package-3",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-7",
        target: "package-5",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-8",
        target: "package-9",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    expect(toposortProjects(projects, projectGraph).map((p) => p.name)).toEqual([
      "package-9",
      "package-8",
      "package-2",
      "package-3",
      "package-4",
      "package-5",
      "package-6",
      "package-7",
      "package-1",
    ]);
  });

  it("should handle cycles with dependencies", async () => {
    // these projects mimic the 'cycle-separate' fixture
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      projectNode({
        name: "a",
      }),
      projectNode({
        name: "b",
      }),
      projectNode({
        name: "c",
      }),
      projectNode({
        name: "d",
      }),
      projectNode({
        name: "e",
      }),
      projectNode({
        name: "f",
      }),
      projectNode({
        name: "g",
      }),
      projectNode({
        name: "h",
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "a",
        target: "b",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "a",
        target: "h",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "b",
        target: "c",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "c",
        target: "d",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "d",
        target: "b",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "h",
        target: "e",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "d",
        target: "g",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "g",
        target: "e",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "e",
        target: "f",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "f",
        target: "g",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    expect(toposortProjects(projects, projectGraph).map((p) => p.name)).toEqual([
      "g",
      "e",
      "f",
      "h",
      "b",
      "c",
      "d",
      "a",
    ]);
  });

  it("should order projects by depth of the tree with leaves first, ignoring incompatible dependencies", () => {
    const projects: ProjectGraphProjectNodeWithPackage[] = [
      // the order of this array is by root path
      // this simulates Object.values(...) on projectGraph.nodes
      // see ./command/create-project-graph-with-packages for details
      projectNode({
        name: "ppp2",
        type: "lib",
        data: {
          root: "packages-other/eee2",
        },
      }),
      projectNode({
        name: "ooo1",
        type: "lib",
        data: {
          root: "packages-other/ooo1",
        },
      }),
      projectNode({
        name: "ooo2",
        type: "lib",
        data: {
          root: "packages-other/ooo2",
        },
      }),
      projectNode({
        name: "other-1",
        type: "lib",
        data: {
          root: "packages/other-1",
        },
      }),
      projectNode({
        name: "other-2",
        type: "lib",
        data: {
          root: "packages/other-2",
        },
      }),
      projectNode({
        name: "other-with-scope",
        type: "lib",
        data: {
          root: "packages/other-with-scope",
        },
      }),
      projectNode({
        name: "package-1",
        type: "lib",
        data: {
          root: "packages/package-1",
        },
      }),
      projectNode({
        name: "package-2",
        type: "lib",
        data: {
          root: "packages/package-2",
        },
      }),
      projectNode({
        name: "package-base",
        type: "lib",
        data: {
          root: "packages/package-base",
        },
      }),
    ];
    const dependencies: ProjectGraphWorkspacePackageDependency[] = [
      projectGraphDependency({
        source: "other-1",
        target: "other-2",
        targetVersionMatchesDependencyRequirement: false,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-1",
        target: "package-base",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "package-2",
        target: "package-base",
        targetVersionMatchesDependencyRequirement: false,
      }),
      projectGraphDependency({
        source: "ooo1",
        target: "ooo2",
        targetVersionMatchesDependencyRequirement: true,
      }),
      projectGraphDependency({
        source: "ooo1",
        target: "ppp2",
        targetVersionMatchesDependencyRequirement: true,
      }),
    ];

    const projectGraph = createProjectGraph({ projects, dependencies });

    expect(toposortProjects(projects, projectGraph).map((p) => p.name)).toEqual([
      "ppp2",
      "ooo2",
      "other-1",
      "other-2",
      "other-with-scope",
      "package-2",
      "package-base",
      "ooo1",
      "package-1",
    ]);
  });
});
