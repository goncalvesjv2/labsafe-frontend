import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../components/Card";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Button from "../components/Button";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/passwordSchema";

function ForgotPassword() {
    const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            email: "",
        },
    });

    const [message, setMessage] = useState("");

    function handleForgotPassword() {
        setMessage("A recuperação de senha ainda não está disponível. Tente novamente mais tarde.");
    }

    function handleInvalidSubmit() {
        setMessage("");
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit(handleForgotPassword, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                    <Title className="text-center">Esqueci minha senha</Title>
                    <p className="text-small text-border text-center">
                        Informe seu e-mail cadastrado para solicitar um link de recuperação.
                    </p>
                    <FormField label="E-mail:" htmlFor="forgot-email" className="text-small">
                        <Input id="forgot-email" type="email" autoComplete="email" placeholder="seu@email.com" required {...register("email", {
                            onChange: () => {
                                clearErrors("email");
                                setMessage("");
                            },
                        })} />
                        {errors.email && <p role="alert" className="text-small text-red-500">{errors.email.message}</p>}
                    </FormField>
                    {message && <p role="status" className="text-small text-border">{message}</p>}
                    <Button type="submit" className="w-full">Enviar</Button>
                    <Link to="/" className="text-small text-primary underline text-center">
                        Voltar para o login
                    </Link>
                </form>
            </Card>
        </div>
    );
}

export default ForgotPassword;
