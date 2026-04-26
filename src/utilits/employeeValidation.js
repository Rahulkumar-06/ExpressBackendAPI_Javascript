export const EmployeeValidationScema = {

    name:{
        notEmpty:{
            errorMessage : "Employee Must Need Name Feeld"
        }
    },
    role : {
        notEmpty:{
            errorMessage : "Role is must need for a Employee"
        }
    }

}