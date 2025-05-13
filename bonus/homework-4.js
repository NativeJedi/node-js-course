class TreeNode {
    children = [];

    constructor(value) {
        this.value = value;
        // Ваш код тут
    }

    // Метод для додавання дочірнього вузла
    addChild(childValue) {
        const childNode = new TreeNode(childValue);
        // Ваш код тут

        this.children.push(childNode);

        return childNode;
    }
}

// Приклад використання
const root = new TreeNode('Root');
const child1 = root.addChild('Child 1');
const child2 = root.addChild('Child 2');
child1.addChild('Grandchild 1.1');
child1.addChild('Grandchild 1.2');
child2.addChild('Grandchild 2.1');

console.log(root);