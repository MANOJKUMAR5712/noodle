"use client"
import Image from "next/image"
import logo from "./assets/logo1.png"
import { useChat } from "ai/react"
import { Message } from "ai"

const noMessages = true;

const Home = ()=>{
    return (
        <main>
            <Image src={logo} width={150} alt = "Noodle logo"></Image>
            <section>
                {
                    noMessages ? (
                        <p>
                            Noodle is freshly served ... 
                            Use the Fork   
                        </p>
                    ) : (
                        <></>
                    )
                }
            </section>
        </main>
    )
}

export default Home ;