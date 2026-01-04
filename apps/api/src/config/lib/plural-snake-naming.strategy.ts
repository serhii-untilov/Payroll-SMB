import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class PluralSnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, customName?: string): string {
        return customName ? customName : this.pluralize(snakeCase(className));
    }

    columnName(propertyName: string, customName?: string): string {
        return customName ?? snakeCase(propertyName);
    }

    relationName(propertyName: string): string {
        return snakeCase(propertyName);
    }

    joinColumnName(relationName: string, referencedColumnName: string): string {
        return snakeCase(`${relationName}_${referencedColumnName}`);
    }

    joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string): string {
        return snakeCase(`${firstTableName}_${firstPropertyName}_${secondTableName}`);
    }

    indexName(tableName: string, columns: string[]): string {
        return `idx_${snakeCase(tableName)}_${columns.join('_')}`;
    }

    foreignKeyName(tableName: string, columnNames: string[], referencedTableName: string): string {
        return `fk_${snakeCase(tableName)}_${columnNames.join('_')}_${snakeCase(referencedTableName)}`;
    }

    private pluralize(name: string): string {
        if (name.endsWith('s')) return name;
        if (name.endsWith('y')) return name.slice(0, -1) + 'ies';
        return name + 's';
    }
}
