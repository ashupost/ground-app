import { NgModule } from '@angular/core';
import { MyExampleDirective } from './my-example/my-example';
import { HighLightDirective } from './high-light/high-light';
@NgModule({
	declarations: [MyExampleDirective,
    HighLightDirective],
	imports: [],
	exports: [MyExampleDirective,
    HighLightDirective]
})
export class DirectivesModule {}
