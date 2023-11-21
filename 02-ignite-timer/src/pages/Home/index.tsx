import { Play } from "phosphor-react";

import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separetor, StartCountdownButton, TaskInput } from "./styles";

import { useForm, } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as zod from "zod"

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'Valor p').max(60, 'Valor G'),
})

//interface NewCycleFormData {
//    task: string;
//    minutesAmount: number;
//}

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

    const { register, handleSubmit, watch } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })
    

    function handleCreateNewCycle(data: NewCycleFormData) {
        console.log(data)
    }

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
           <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <FormContainer>
                <label htmlFor="task">Vou trabalhar em</label>
                <TaskInput 
                    id="task" 
                    list="task-suggestion"  
                    placeholder="Dê um nome para o seu projeto"
                    {...register('task')}
                />

                <datalist id="task-suggestion">
                    <option value="Projeto 1" />
                    <option value="Projeto 2" />
                    <option value="Projeto 3" />
                    <option value="Projeto Manga" 
                />

                </datalist>

                <label htmlFor="minutesAmount">durante</label>
                <MinutesAmountInput 
                    type="number" 
                    placeholder="00" 
                    id="minutesAmount" 
                    step={5}
                    min={5}
                    //max={60}
                    {...register('minutesAmount', {valueAsNumber: true})}
                />

                <span>minutos.</span>
            </FormContainer>

           <CountDownContainer>
                <span>0</span>
                <span>0</span>
                <Separetor>:</Separetor>
                <span>0</span>
                <span>0</span>
           </CountDownContainer>

           <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
           </StartCountdownButton>
           </form>
        </HomeContainer>
    )
}