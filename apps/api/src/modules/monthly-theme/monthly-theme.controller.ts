import { Request, Response } from 'express'
import {
    createMonthlyTheme,
    getActiveTheme,
    getAllThemes,
    updateMonthlyTheme,
    setActiveTheme,
    deleteMonthlyTheme,
} from './monthly-theme.service'

export const create = async (req: Request, res: Response) => {
    try {
        const theme = await createMonthlyTheme({
            ...req.body,
            createdById: req.user!.userId,
        })
        res.status(201).json({
            status: 'success',
            message: 'Theme of the month created',
            data: theme,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getActive = async (req: Request, res: Response) => {
    try {
        const theme = await getActiveTheme()
        res.status(200).json({ status: 'success', data: theme ?? null })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const themes = await getAllThemes()
        res.status(200).json({ status: 'success', data: themes })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const theme = await updateMonthlyTheme(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Theme updated',
            data: theme,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const activate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const theme = await setActiveTheme(id)
        res.status(200).json({
            status: 'success',
            message: 'Theme set as active',
            data: theme,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await deleteMonthlyTheme(id)
        res.status(200).json({
            status: 'success',
            message: 'Theme deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}