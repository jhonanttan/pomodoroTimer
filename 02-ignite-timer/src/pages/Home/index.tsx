import { Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separetor, StartCountdownButton, TaskInput } from "./styles";
import { useState } from "react";

export function Home() {

    const [task, setTask] = useState('');

    function handleSubmit() {
        
    }

    return (
        <HomeContainer>
           <form onSubmit={handleSubmit} action="">
            <FormContainer>
                <label htmlFor="task">Vou trabalhar em</label>
                <TaskInput id="task" 
                list="task-suggestion"  
                placeholder="Dê um nome para o seu projeto"
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

           <StartCountdownButton disabled={!task} type="submit">
            <Play size={24} />
            Começar
           </StartCountdownButton>
           </form>
        </HomeContainer>
    )
}