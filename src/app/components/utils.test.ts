import {convertToRgb, isTypographyToken, lightOrDark, slugify, checkAndEvaluateMath, isSingleToken} from './utils';

describe('checkmath', () => {
    it('calculates math', () => {
        const input = '25 * 4.5 + 0.175';
        const output = 112.675;
        expect(checkAndEvaluateMath(input)).toEqual(output);
    });
});

describe('isSingleToken', () => {
    it('correctly asserts a single token', () => {
        const basic = {
            type: 'color',
            name: 'colors.blue',
            value: '#0000ff',
        };
        const extraData = {
            type: 'color',
            name: 'colors.blue',
            value: '#0000ff',
            description: 'Such wow.',
        };
        expect(isSingleToken(basic)).toBe(true);
        expect(isSingleToken(extraData)).toBe(true);
    });
    it('rejects token groups', () => {
        const wrongToken = {
            label: {
                type: 'color',
                name: 'colors.blue',
                value: '#0000ff',
            },
            value: {
                type: 'color',
                name: 'colors.blue',
                value: '#0000ff',
            },
        };

        expect(isSingleToken(wrongToken)).toBe(false);
    });
});

describe('isTypographyToken', () => {
    it('returns truthiness of a typography token and only accepts tokens that feature required values', () => {
        const token = {
            fontFamily: 'foo',
        };
        const weight = {
            fontWeight: 'foo',
        };
        const height = {
            lineHeight: 'foo',
        };
        const fullToken = {
            fontFamily: 'foo',
            fontWeight: 'normal',
            fontSize: '32',
        };
        expect(isTypographyToken(token)).toBe(false);
        expect(isTypographyToken(fullToken)).toBe(true);
        expect(isTypographyToken(weight)).toBe(false);
        expect(isTypographyToken(height)).toBe(false);
    });
    it('rejects non-typography tokens', () => {
        const wrongToken = {
            value: {
                fontFamily: 'foo',
            },
        };

        const stringToken = 'string';

        expect(isTypographyToken(wrongToken)).toBe(false);
        expect(isTypographyToken(stringToken)).toBe(false);
    });
});

describe('convertToRgb', () => {
    it('transforms a color string to rgb values', () => {
        const rgbhex = 'rgb(#ff0000, 0.5)';
        const hex = '#ff0000';

        expect(convertToRgb(rgbhex)).toBe('#ff000080');
        expect(convertToRgb(hex)).toBe('#ff0000');
    });

    it('converts rgba to hex', () => {
        const input = 'rgba(56, 132, 217, 0.15)';
        const output = '#3884d926';

        expect(convertToRgb(input)).toBe(output);
    });

    it('transforms a gradient string to rgb values', () => {
        const gradient1 = 'linear-gradient(rgb(#ff0000, 0.5) 0%, #ffffff 100%)';
        const gradient2 = 'linear-gradient(rgb(#ff0000, 0.5) 0%, rgba(#ffffff, 1) 100%)';
        const gradient3 = 'linear-gradient(rgba(255, 255, 0, 0.5) 0%, rgba(#000000, 0) 100%)';

        expect(convertToRgb(gradient1)).toBe('linear-gradient(#ff000080 0%, #ffffff 100%)');
        expect(convertToRgb(gradient2)).toBe('linear-gradient(#ff000080 0%, #ffffffff 100%)');
        expect(convertToRgb(gradient3)).toBe('linear-gradient(#ffff0080 0%, #00000000 100%)');
    });

    it('transforms multiple color stops to rgb values', () => {
        const gradient1 = 'linear-gradient(#ff0000 0%, rgb(#ff0000, 0.3) 50%, rgb(255, 0, 0, 1) 100%)';

        expect(convertToRgb(gradient1)).toBe('linear-gradient(#ff0000 0%, #ff00004d 50%, #ff0000ff 100%)');
    });
});

describe('lightToDark', () => {
    it('knows when a color is bright', () => {
        const light = '#fff';
        const lightRgb = 'rgb(255,255,255)';
        const lightRgba = 'rgba(255,255,255,1)';
        expect(lightOrDark(light)).toBe('light');
        expect(lightOrDark(lightRgb)).toBe('light');
        expect(lightOrDark(lightRgba)).toBe('light');
    });
    it('knows when a color is dark', () => {
        const black = '#000';
        const darkEnough = '#F3F3F3';
        const darkRgb = 'rgb(0,0,0)';
        const darkRgba = 'rgba(0,0,0,1)';
        expect(lightOrDark(black)).toBe('dark');
        expect(lightOrDark(darkEnough)).toBe('dark');
        expect(lightOrDark(darkRgb)).toBe('dark');
        expect(lightOrDark(darkRgba)).toBe('dark');
    });
});
describe('slugfy', () => {
    it('converts a string to a slug', () => {
        const string = 'Neue Montreal';
        expect(slugify(string)).toBe('neue-montreal');
    });
});
