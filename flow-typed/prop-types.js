// https://github.com/flowtype/flow-typed/blob/master/definitions/npm/prop-types_v15.x.x/flow_v0.41.x-/prop-types_v15.x.x.js
type $npm$propTypes$ReactPropsCheckType = (
  props: any,
  propName: string,
  componentName: string,
  href?: string
) => ?Error;

declare module 'prop-types' {
  declare function checkPropTypes<V>(
    propTypes: $Subtype<{ [_: $Keys<V>]: $npm$propTypes$ReactPropsCheckType }>,
    values: V,
    location: string,
    componentName: string,
    getStack: ?() => ?string
  ): void;

  declare module.exports: {
    array: React$PropType$Primitive<Array<any>>,
    bool: React$PropType$Primitive<boolean>,
    func: React$PropType$Primitive<Function>,
    number: React$PropType$Primitive<number>,
    object: React$PropType$Primitive<Object>,
    string: React$PropType$Primitive<string>,
    any: React$PropType$Primitive<any>,
    arrayOf: React$PropType$ArrayOf,
    element: React$PropType$Primitive<any>,
    instanceOf: React$PropType$InstanceOf,
    node: React$PropType$Primitive<any>,
    objectOf: React$PropType$ObjectOf,
    oneOf: React$PropType$OneOf,
    oneOfType: React$PropType$OneOfType,
    shape: React$PropType$Shape
  };
}
