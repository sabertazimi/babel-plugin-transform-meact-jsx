module.exports = (babel) => {
    const t = babel.types;
    let isJSXExisted = false;
    let isMeactContextEnabled = false;

    return {
        visitor: {
            Program: {
                exit(path) {
                    if (isJSXExisted === true && isMeactContextEnabled === false) {
                        throw path.buildCodeFrameError(
                            `Meact isn't in current context!`
                        );
                    }
                }
            },
            ImportDeclaration(path, state) {
                if (path.node.specifiers[0].local.name === 'Meact') {
                    isMeactContextEnabled = true;
                }
            },
            MemberExpression(path, state) {
                if (path.node.object.name === 'React' && path.node.property.name === 'createElement') {
                    isJSXExisted = true;
                    path.replaceWith(t.MemberExpression(t.identifier('Meact') ,t.identifier('createElement')));
                }
            },
        }
    }
}; 