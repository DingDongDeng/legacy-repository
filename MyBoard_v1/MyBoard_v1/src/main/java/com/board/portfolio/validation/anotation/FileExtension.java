package com.board.portfolio.validation.anotation;

import com.board.portfolio.validation.validator.constraint.FileExtensionValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FileExtensionValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FileExtension {
    String message() default "not allow file extension";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String[] fileExtension();
    boolean nullable();
}

