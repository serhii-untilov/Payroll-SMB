import { Injectable } from '@nestjs/common';
import FlakeId = require('flake-idgen');
import intformat = require('biguint-format');

@Injectable()
export class SnowflakeService {
    private flake: FlakeId;

    constructor() {
        this.flake = new FlakeId();
    }

    generate(): string {
        const idBuffer = this.flake.next();
        return intformat(idBuffer, 'dec'); // returns string
    }
}
