import {mergeDeep} from '@/plugin/helpers';
import {SingleTokenObject, TokenType} from '@types/tokens';
import set from 'set-value';

import tokenTypes from '../../config/tokenTypes';

// Sort tokens by the last part of their name, e.g. global.colors.gray.50 comes before global.colors.gray.100
function sortTokens(tokens) {
    return tokens.sort((a, b) => {
        return a.name.split('.').pop() - b.name.split('.').pop();
    });
}

function transformName(name) {
    switch (name) {
        case 'color':
        case 'colors':
            return 'color';
        case 'space':
        case 'spacing':
            return 'spacing';
        case 'size':
        case 'sizing':
            return 'sizing';
        case 'boxShadow':
            return 'boxShadow';
        case 'border':
            return 'border';
        case 'borderRadius':
            return 'borderRadius';
        case 'borderWidth':
            return 'borderWidth';
        case 'opacity':
            return 'opacity';
        case 'fontFamilies':
            return 'fontFamilies';
        case 'fontWeights':
            return 'fontWeights';
        case 'fontSizes':
            return 'fontSizes';
        case 'lineHeights':
            return 'lineHeights';
        case 'typography':
            return 'typography';
        case 'letterSpacing':
            return 'letterSpacing';
        case 'paragraphSpacing':
            return 'paragraphSpacing';
        default:
            return 'other';
    }
}

export function appendTypeToToken(token) {
    const hasTypeProp = token.type && token.type !== '' && token.type !== 'undefined';
    const typeToSet = hasTypeProp ? token.type : transformName(token.name.split('.').slice(0, 1).toString());
    return {
        ...token,
        type: typeToSet,
    };
}

// Creates a tokens object so that tokens are displayed in groups in the UI.
export function createTokensObject(tokens: SingleTokenObject[], tokenFilter = '') {
    if (tokens.length > 0) {
        const tokensSorted = sortTokens(tokens);
        const obj = tokensSorted.reduce((acc, cur) => {
            if (tokenFilter === '' || cur.name?.toLowerCase().search(tokenFilter?.toLowerCase()) >= 0) {
                const hasTypeProp = cur.type && cur.type !== '' && cur.type !== 'undefined';
                const propToSet = hasTypeProp ? cur.type : transformName(cur.name.split('.').slice(0, 1).toString());
                acc[propToSet] = acc[propToSet] || {values: {}};
                acc[propToSet].values = acc[propToSet].values || {};
                set(acc[propToSet].values, cur.name, {...cur, type: hasTypeProp ? cur.type : propToSet});
            }
            return acc;
        }, {});
        return obj;
    }
    return {};
}

// Takes an array of tokens, transforms them into an object and merges that with values we require for the UI
export function mappedTokens(tokens: SingleTokenObject[], tokenFilter: string) {
    const tokenObj = {};
    Object.entries(createTokensObject(tokens, tokenFilter)).forEach(
        ([key, group]: [string, {values: SingleTokenObject[]; type?: TokenType}]) => {
            tokenObj[key] = {
                values: group.values,
            };
        }
    );

    mergeDeep(tokenObj, tokenTypes);

    return Object.entries(tokenObj);
}
