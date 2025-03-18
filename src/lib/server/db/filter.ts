type Condition = {
  field: string;
  operator: string;
  value: string | number | boolean | null;
  cast?: 'lower' | 'date' | 'time'; // Add more casting options as needed
};

type LogicalGroup = {
  logic: 'and' | 'or';
  conditions: (Condition | LogicalGroup)[];
};

type FilterResult = Condition | LogicalGroup;

function parseCondition(conditionStr: string): Condition {
  let insideQuotes = false;
  let buffer = '';
  let field = '';
  let operator = '';
  let valueStr = '';
  const possibleOperators = ['!=', '>=', '<=', '!~', '=', '>', '<', '~', '?=', '?!='];

  for (let i = 0; i < conditionStr.length; i++) {
    const char = conditionStr[i];
    if (char === '"') insideQuotes = !insideQuotes;

    if (!insideQuotes) {
      for (const op of possibleOperators) {
        if (conditionStr.startsWith(op, i)) {
          field = buffer.trim();
          operator = op;
          valueStr = conditionStr.slice(i + op.length).trim();
          i = conditionStr.length; // Exit loop
          break;
        }
      }
    }
    buffer += char;
  }

  if (!operator) throw new Error(`Invalid condition: ${conditionStr}`);

  // Parse casting if field contains a colon
  let cast: 'lower' | 'date' | 'time' | undefined;
  if (field.includes(':')) {
    const [fieldName, castType] = field.split(':');
    field = fieldName;
    if (['lower', 'date', 'time'].includes(castType)) {
      cast = castType as 'lower' | 'date' | 'time';
    } else {
      throw new Error(`Unsupported cast type: ${castType}`);
    }
  }

  // Parse value
  let value: string | number | boolean | null;
  if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
    value = valueStr.slice(1, -1);
  } else if (valueStr === 'true') {
    value = true;
  } else if (valueStr === 'false') {
    value = false;
  } else if (valueStr === 'null') {
    value = null;
  } else if (!isNaN(Number(valueStr))) {
    value = parseFloat(valueStr);
  } else {
    value = valueStr;
  }

  return { field, operator, value, cast };
}

function tokenizeFilterString(filter: string): string[] {
  const tokens: string[] = [];
  let currentToken = '';
  let insideQuotes = false;

  for (let i = 0; i < filter.length; i++) {
    const char = filter[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentToken += char;
      continue;
    }

    if (!insideQuotes) {
      // Check for parentheses
      if (char === '(' || char === ')') {
        if (currentToken) {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        tokens.push(char);
        continue;
      }

      // Check for logical operators
      if (filter.startsWith('&&', i) || filter.startsWith('||', i)) {
        if (currentToken) {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        tokens.push(filter.slice(i, i + 2));
        i++; // Skip next character
        continue;
      }
    }

    currentToken += char;
  }

  if (currentToken) tokens.push(currentToken.trim());
  return tokens;
}

function parseTokenized(tokens: string[]): FilterResult {
  let index = 0;

  function parseElement(): Condition | LogicalGroup {
    if (tokens[index] === '(') {
      index++;
      const group = parseGroup();
      if (tokens[index] !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      index++;
      return group;
    }
    return parseCondition(tokens[index++]);
  }

  function parseGroup(): LogicalGroup {
    const elements: (Condition | LogicalGroup)[] = [];
    const operators: string[] = [];

    elements.push(parseElement());

    while (index < tokens.length && (tokens[index] === '&&' || tokens[index] === '||')) {
      operators.push(tokens[index++]);
      elements.push(parseElement());
    }

    if (operators.length > 0) {
      const firstOp = operators[0];
      if (!operators.every(op => op === firstOp)) {
        throw new Error('Mixed logical operators in group');
      }
      return {
        logic: firstOp === '&&' ? 'and' : 'or',
        conditions: elements,
      };
    }

    return elements[0] as LogicalGroup; // Return single element if no operators
  }

  const result = parseGroup();
  if (index !== tokens.length) {
    throw new Error(`Unexpected tokens at position ${index}: ${tokens.slice(index)}`);
  }
  return result;
}

export function parseFilter(filter: string): FilterResult {
  if (typeof filter !== 'string') {
    throw new Error('Filter must be a string');
  }
  const tokens = tokenizeFilterString(filter);
  return parseTokenized(tokens);
}