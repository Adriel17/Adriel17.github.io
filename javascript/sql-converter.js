class SqlKeywordUppercaser {
  constructor(options = {}) {
    const defaultKeywords = [
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "FULL JOIN",
      "CROSS JOIN",
      "ORDER BY",
      "GROUP BY",
      "PARTITION BY",
      "UNION ALL",
      "SELECT",
      "FROM",
      "WHERE",
      "JOIN",
      "ON",
      "AND",
      "OR",
      "NOT",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
      "IS",
      "NULL",
      "AS",
      "DISTINCT",
      "TOP",
      "HAVING",
      "INSERT",
      "INTO",
      "VALUES",
      "UPDATE",
      "SET",
      "DELETE",
      "CREATE",
      "TABLE",
      "ALTER",
      "DROP",
      "INDEX",
      "VIEW",
      "UNION",
      "ALL",
      "CASE",
      "WHEN",
      "THEN",
      "ELSE",
      "END",
      "WITH",
      "OVER",
      "COUNT",
      "SUM",
      "AVG",
      "MAX",
      "MIN",
      "CAST",
      "CONVERT",
      "COALESCE",
      "ISNULL",
      "NULLIF",
      "EXEC",
      "EXECUTE",
      "BEGIN",
      "COMMIT",
      "ROLLBACK",
      "TRANSACTION",
      "DECLARE",
      "USE",
      "GO"
    ];

    const keywords = options.keywords || defaultKeywords;

    this.keywords = [...keywords].sort((a, b) => b.length - a.length);
  }

  convert(sqlText) {
    if (typeof sqlText !== "string") {
      throw new TypeError("O parâmetro sqlText deve ser uma string.");
    }

    const parser = new SqlTextParser(sqlText, this.keywords);
    return parser.parse();
  }
}

class SqlTextParser {
  constructor(text, keywords) {
    this.text = text;
    this.keywords = keywords;
    this.position = 0;
    this.result = [];
  }

  parse() {
    while (!this.isEnd()) {
      if (this.isLineCommentStart()) {
        this.consumeLineComment();
        continue;
      }

      if (this.isBlockCommentStart()) {
        this.consumeBlockComment();
        continue;
      }

      if (this.isSingleQuotedStringStart()) {
        this.consumeSingleQuotedString();
        continue;
      }

      if (this.isDoubleQuotedStringStart()) {
        this.consumeDoubleQuotedString();
        continue;
      }

      if (this.tryConsumeKeyword()) {
        continue;
      }

      this.result.push(this.currentChar());
      this.position++;
    }

    return this.result.join("");
  }

  tryConsumeKeyword() {
    for (const keyword of this.keywords) {
      const textSlice = this.text.slice(this.position, this.position + keyword.length);

      if (textSlice.toUpperCase() !== keyword) {
        continue;
      }

      if (!this.isWholeKeyword(keyword.length)) {
        continue;
      }

      this.result.push(keyword);
      this.position += keyword.length;
      return true;
    }

    return false;
  }

  isWholeKeyword(length) {
    const previousChar = this.position > 0 ? this.text[this.position - 1] : "";
    const nextChar =
      this.position + length < this.text.length
        ? this.text[this.position + length]
        : "";

    const previousIsIdentifier = this.isIdentifierChar(previousChar);
    const nextIsIdentifier = this.isIdentifierChar(nextChar);

    return !previousIsIdentifier && !nextIsIdentifier;
  }

  isIdentifierChar(char) {
    return /[A-Za-z0-9_]/.test(char);
  }

  consumeLineComment() {
    const start = this.position;
    let end = this.text.indexOf("\n", this.position);

    if (end === -1) {
      end = this.text.length;
    }

    this.result.push(this.text.slice(start, end));
    this.position = end;
  }

  consumeBlockComment() {
    const start = this.position;
    let end = this.text.indexOf("*/", this.position + 2);

    if (end === -1) {
      end = this.text.length;
    } else {
      end += 2;
    }

    this.result.push(this.text.slice(start, end));
    this.position = end;
  }

  consumeSingleQuotedString() {
    const start = this.position;
    this.position++;

    while (!this.isEnd()) {
      if (this.currentChar() === "'") {
        if (this.peekChar(1) === "'") {
          this.position += 2;
          continue;
        }

        this.position++;
        break;
      }

      this.position++;
    }

    this.result.push(this.text.slice(start, this.position));
  }

  consumeDoubleQuotedString() {
    const start = this.position;
    this.position++;

    while (!this.isEnd()) {
      if (this.currentChar() === '"') {
        if (this.peekChar(1) === '"') {
          this.position += 2;
          continue;
        }

        this.position++;
        break;
      }

      this.position++;
    }

    this.result.push(this.text.slice(start, this.position));
  }

  isLineCommentStart() {
    return this.currentChar() === "-" && this.peekChar(1) === "-";
  }

  isBlockCommentStart() {
    return this.currentChar() === "/" && this.peekChar(1) === "*";
  }

  isSingleQuotedStringStart() {
    return this.currentChar() === "'";
  }

  isDoubleQuotedStringStart() {
    return this.currentChar() === '"';
  }

  currentChar() {
    return this.text[this.position];
  }

  peekChar(offset) {
    return this.text[this.position + offset];
  }

  isEnd() {
    return this.position >= this.text.length;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SqlKeywordUppercaser
  };
}