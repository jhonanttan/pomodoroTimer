import { HandPalm, Play } from "phosphor-react";

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";

import { FormProvider, useForm, } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as zod from "zod"
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/CountDown";



interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
}

interface CycleContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CycleContextType)

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(1, 'Valor p').max(60, 'Valor G'),
})


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [ activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [ amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished( ) {
        setCycles(state => 
            state.map(cycle => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date()}
                } else {
                    return cycle;
            }
        }),
        )
    }
    

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
        setCycles( state => 
            state.map(cycle => {
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



    console.log(activeCycle)

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
           <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <CyclesContext.Provider 
            value={{ 
                    activeCycle, 
                    activeCycleId, 
                    markCurrentCycleAsFinished, 
                    amountSecondsPassed, 
                    setSecondsPassed, 
                }}>

                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <CountDown />
            </CyclesContext.Provider>
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