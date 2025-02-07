import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isTwoDecimalPlaces", async: false })
export class IsTwoDecimalPlacesConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (typeof value !== "number") return false;
    return /^(\d+(\.\d{1,2})?)$/.test(value.toString());
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a number with at most two decimal places`;
  }
}
