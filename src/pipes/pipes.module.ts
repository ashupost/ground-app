import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time/relative-time';
import { AddressPipe } from './address/address';
import { AgePipe } from './age/age';
@NgModule({
	declarations: [RelativeTimePipe,AddressPipe,
    AgePipe],
	imports: [],
	exports: [RelativeTimePipe, AddressPipe,
    AgePipe]
})
export class PipesModule {}
