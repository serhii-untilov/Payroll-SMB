import { ICreateUser } from '@repo/shared';
import { useForm, SubmitHandler } from 'react-hook-form';

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ICreateUser>();
    const onSubmit: SubmitHandler<ICreateUser> = (data) => console.log(data);

    console.log(watch('name')); // watch input value by passing the name of it

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input defaultValue="user" {...(register('name'), { required: true })} />
            <input defaultValue="user@mail.com" {...(register('email'), { required: true })} />
            <input {...(register('password'), { required: true })} />
            <input {...register('roles')} />
            {/* errors will return when field validation fails  */}
            {errors.name && <span>This field is required</span>}
            {errors.email && <span>This field is required</span>}
            {errors.password && <span>This field is required</span>}
            <input type="submit" />
        </form>
    );
}
