const averageGrade = (person) => {
    if (!Array.isArray(person?.grades)) {
        throw new Error('No grades found');
    }



    const scoreSum = person.grades.reduce((acc, { score }) => {
        const validGrade = score ?? 0;

        return acc + validGrade;
    }, 0);

    const average = scoreSum / person.grades.length;

    return Number(average.toFixed(2));
}


averageGrade({
    name: 'Chill Student', grades: [
        {
            name: 'Math',
            score: 1,
        },
        {
            name: 'Science',
            score: 5
        },
        {
            name: 'Invalid Name',
            score: null
        },
        {
            name: 'Invalid Subject',
            score: undefined
        },
        {
            name: 'Biology',
            score: 10
        }]
});

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);

        if (!this.root) {
            this.root = newNode;
            return this;
        }

        let current = this.root;

        while (true) {
            if (value === current.value) return this;

            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    find(value) {
        if (!this.root) return false;

        let current = this.root;
        let found = false;

        while (current && !found) {
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                found = true;
            }
        }

        return found;
    }

    toString() {
        const formatNode = (node, level = 0) => {
            if (!node) return '';
            const indent = '  '.repeat(level);
            return `${indent}${node.value}\n${formatNode(node.left, level + 1)}${formatNode(node.right, level + 1)}`;
        };
        return formatNode(this.root);
    }
}

const tree = new BinarySearchTree();
tree.insert(10);
tree.insert(5);
tree.insert(15);
tree.insert(3);
tree.insert(7);
tree.insert(12);
tree.insert(17);

console.log(tree.toString()); // Output: 10