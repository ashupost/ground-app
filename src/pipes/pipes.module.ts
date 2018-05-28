import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time/relative-time';
import { AddressPipe } from './address/address';
@NgModule({
	declarations: [RelativeTimePipe,AddressPipe],
	imports: [],
	exports: [RelativeTimePipe, AddressPipe]
})
export class PipesModule {}
