import { NgModule } from '@angular/core';
import { MyExampleDirective } from './my-example/my-example';
@NgModule({
	declarations: [MyExampleDirective],
	imports: [],
	exports: [MyExampleDirective]
})
export class DirectivesModule {}
