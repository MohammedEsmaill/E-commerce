export enum rolesTypes {
    admin = "admin",
    user = "user",
}

export enum genderTypes {
    male = "male",
    female = "female",
}

export enum otpTypes {
    confirmation = "confirmation",
    resetPassword = "resetPassword",
    forgetPassword = "forgetPassword",
    changePhone = "changePhone"
}

export enum tokenTypes {
    access = "access",
    refresh = "refresh"
}

export enum paymentMethodTypes {
    cash = "cash",
    card = "card"
}

export enum orderStatusTypes {
    pending = "pending",
    success = "success",
    failed = "failed",
    canceled = "canceled",
    onWay = "onWay",
    delivered = "delivered",
    placed = "placed",
    rejected = "rejected",
    refunded = "refunded",
    paid = "paid"
}