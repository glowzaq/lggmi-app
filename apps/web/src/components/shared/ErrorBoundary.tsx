'use client'

import { AlertTriangle } from "lucide-react"
import { Component, ReactNode } from "react"
import { Button } from "../ui/button"

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    message: string
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor (props: Props) {
        super(props)
        this.state = {hasError: false, message: ''}
    }

    static getDerivedStateFromError(error: Error): State {
        return {hasError: true, message: error.message}
    }

    render () {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center space-y-4 max-w-md px-6">
                        <div className="p-4 bg-red-50 rounded-full w-fit mx-auto">
                            <AlertTriangle className="h-8 w-8 text-red-500"/>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Something went wrong
                        </h2>
                        <p className="text-slate-500 text-sm">{this.state.message}</p>
                        <Button onClick={()=>this.setState({hasError: false, message: ''})}>
                            Try again
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}