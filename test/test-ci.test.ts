import { filterByTerm } from '../src/test-ci';

test ('Should filter a corrrect term', () => {
    const result = filterByTerm([{ url: 'string1' }, { url: 'string2' }, { url: 'java1' }], 'java');
    expect(result).toEqual([{url: 'java1'}])
})
