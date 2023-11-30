import { HandPalm, Play } from "phosphor-react";

import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separetor, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";

import { useForm, } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as zod from "zod"
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'Valor p').max(60, 'Valor G'),
})


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
}



export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [ activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [ amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate),)
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle])
    

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountSecondsPassed(0);
        reset();
    }

    function handleInterruptCycle() {
        setCycles(cycles.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, interruptDate: new Date()}
            } else {
                return cycle;
            }
        }),
        );
        setActiveCycleId(null);
        document.title = `IGNITE TIMER`;
    }

     

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`;
        }
    }, [minutes, seconds, activeCycle])


    console.log(activeCycle)

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
                    disabled={!!activeCycle}
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
                    max={60}
                    disabled={!!activeCycle}
                    {...register('minutesAmount', {valueAsNumber: true})}
                />

                <span>minutos.</span>
            </FormContainer>

           <CountDownContainer>
                <span>{minutes[0]}</span>
                <span>{minutes[1]}</span>
                <Separetor>:</Separetor>
                <span>{seconds[0]}</span>
                <span>{seconds[1]}</span>
           </CountDownContainer>

           {
            activeCycle ? (
                <StopCountdownButton onClick={handleInterruptCycle} type="button">
                    <HandPalm size={24} />
                    Interromper
                </StopCountdownButton>
            ) : (
                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            )
           }
           </form>
        </HomeContainer>
    )
}