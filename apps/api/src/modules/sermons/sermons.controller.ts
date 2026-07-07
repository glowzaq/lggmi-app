import { Request, Response } from "express";
import { createSermon, deleteSermon, getAllSeries, getAllSermons, getLatestSermons, getSermonById, updateSermon } from "./sermons.service";

export const create = async (req: Request, res: Response) => {
    try {
        const sermon = await createSermon(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Sermon created successfully',
            data: sermon,
        })   
    } catch (error:any) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const { series } = req.query
        const sermons = await getAllSermons(series as string | undefined)
        res.status(200).json({ status: 'success', data: sermons })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getLatest = async (req: Request, res: Response) => {
    try {
        const sermons = await getLatestSermons()
        res.status(200).json({ status: 'success', data: sermons })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getSeries = async (req: Request, res: Response) => {
    try {
        const series = await getAllSeries()
        res.status(200).json({ status: 'success', data: series })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const sermon = await getSermonById(id)
        res.status(200).json({ status: 'success', data: sermon })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const sermon = await updateSermon(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Sermon updated successfully',
            data: sermon,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await deleteSermon(id)
        res.status(200).json({
            status: 'success',
            message: 'Sermon deleted successfully',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}
