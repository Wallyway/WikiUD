export function buildAccentInsensitiveRegex(query: string) {
    let pattern = '';
    for (const char of query) {
        const lowerChar = char.toLowerCase();
        switch (lowerChar) {
            case 'a': pattern += '[aàáâãäå]'; break;
            case 'e': pattern += '[eèéêë]'; break;
            case 'i': pattern += '[iìíîï]'; break;
            case 'o': pattern += '[oòóôõö]'; break;
            case 'u': pattern += '[uùúûü]'; break;
            case 'n': pattern += '[nñ]'; break;
            default: pattern += char;
        }
    }
    return pattern;
} 