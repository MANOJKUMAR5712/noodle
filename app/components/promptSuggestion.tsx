import PromptSuggestionButton from "./promptSuggestionButton";

const PromptSuggestion = ({onPromptClick}) => {

const prompts = [
    "Who is cristopher nolan ?",
    "What movies did he make ?",
    "How many awards he have won ?",
    "What is the highest rated movies of his filmography ?"
]

  return (
    <div>
        {prompts.map((prompt,index)=><PromptSuggestionButton text={prompt} onClick = {()=>onPromptClick(prompt)} key={`suggestion-${index}`}/>)}
    </div>
  )
}

export default PromptSuggestion;