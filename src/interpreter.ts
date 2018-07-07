import {
  StatementVistor,
  ExpressionVistor,
  LiteralExpression,
  GroupingExpression,
  Expression,
  UnaryExpression,
  BinaryExpression,
  LogicalExpression,
  AssignExpression,
  BlockStatement,
  CallExpression,
  ClassStatement,
  ExpressionStatement,
  FunctionStatement,
  GetExpression,
  IfStatement,
  PrintStatement,
  ReturnStatement,
  SetExpression,
  SuperExpression,
  ThisExpression,
  VarExpression,
  VarStatement,
  WhileStatement,
  Statement
} from "./ast";
import { TokenType } from "./token";
import { SymbolTable } from "./symbolTable";

export class Interpreter implements StatementVistor, ExpressionVistor {
  statements: Statement[];
  symbolTable: SymbolTable;

  constructor(statements: Statement[]) {
    this.statements = statements;
    this.symbolTable = new SymbolTable();
  }

  interpret() {
    this.statements.forEach(statement => this.execute(statement));
  }

  visitLiternalExpression(liternal: LiteralExpression) {
    return liternal.value;
  }

  visitGroupingExpression(group: GroupingExpression) {
    return this.evaluate(group.expression);
  }

  visitUnaryExpression(unary: UnaryExpression) {
    const right = this.evaluate(unary.right);

    switch (unary.opeartor.type) {
      case TokenType.MINUS:
        return -right;
      case TokenType.BANG:
        return !right;
      default:
        return right;
    }
  }

  visitBinaryExpression(binary: BinaryExpression) {
    const left = this.evaluate(binary.left);
    const right = this.evaluate(binary.right);

    switch (binary.operator.type) {
      case TokenType.MINUS:
        return left + right;
      case TokenType.PLUS:
        return left + right;
      case TokenType.STAR:
        return left * right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.EQUAL_EQUAL:
        return left === right;
      case TokenType.BANG_EQUAL:
        return left !== right;
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left < right;
      case TokenType.LESS_EQUAL:
        return left <= right;
    }
  }

  visitLogicalExpression(logical: LogicalExpression) {
    const left = this.evaluate(logical.left);
    const right = this.evaluate(logical.right);

    switch (logical.opeartor.type) {
      case TokenType.AND:
        return left && right;
      case TokenType.OR:
        return left || right;
    }
  }

  visitVarExpression(varExpression: VarExpression) {
    return this.symbolTable.lookup(varExpression.name);
  }

  visitAssignExpression(assign: AssignExpression) {
    const value = this.evaluate(assign.expression);

    this.symbolTable.define(assign.name, value);
    return value;
  }

  visitExpressionStatement(expressionStatement: ExpressionStatement) {
    return this.evaluate(expressionStatement.expression);
  }

  visitVarStatement(varStatement: VarStatement) {
    let value;

    if (varStatement.initializer) {
      value = this.evaluate(varStatement.initializer);
    }
    this.symbolTable.define(varStatement.name, value);
  }

  visitBlockStatement(blockStatement: BlockStatement) {
    const currentScope = this.symbolTable;

    this.symbolTable = new SymbolTable(currentScope);
    blockStatement.statements.forEach(statement => this.execute(statement));
    this.symbolTable = currentScope;
  }

  visitPrintStatement(printStatement: PrintStatement) {
    const value = this.evaluate(printStatement.expression);

    console.log(value);
  }

  visitIfStatement(ifStatement: IfStatement) {
    if (this.evaluate(ifStatement.condition)) {
      this.execute(ifStatement.thenBranch);
    } else if (ifStatement.elseBranch) {
      this.execute(ifStatement.elseBranch);
    }
  }

  visitWhileStatement(whileStatement: WhileStatement) {
    while (
      whileStatement.condition &&
      this.evaluate(whileStatement.condition)
    ) {
      this.execute(whileStatement.body);
    }
  }

  evaluate(expression: Expression) {
    return expression.accept(this);
  }

  execute(statement: Statement) {
    statement.accept(this);
  }

  visitCallExpression(call: CallExpression) {}
  visitGetExpression(getExpression: GetExpression) {}
  visitSetExpression(setExpression: SetExpression) {}
  visitSuperExpression(superExpression: SuperExpression) {}
  visitThisExpression(thisExpression: ThisExpression) {}
  visitClassStatement(classStatement: ClassStatement) {}
  visitFunctionStatement(functionStatement: FunctionStatement) {}
  visitReturnStatement(returnStatement: ReturnStatement) {}
}
