export class EmployeePathUtil {
    static calculatePath(parentPath: string, parentId: number): string {
        return parentPath ? `${parentPath}${parentId}.` : `${parentId}.`;
    }

    static calculateHierarchyLevel(path: string): number {
        return path.split('.').filter(Boolean).length;
    }
}