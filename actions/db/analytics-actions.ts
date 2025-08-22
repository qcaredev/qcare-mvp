/**
 * @file analytics-actions.ts
 *
 * @description
 * This file contains server actions dedicated to fetching and processing
 * analytics data from the `consult_history` table. These actions are designed
 * to be called from the Admin Dashboard and are scoped by branch.
 */
"use server"

import { db } from "@/db/db"
import { consultHistoryTable, SelectConsultHistory } from "@/db/schema"
import { ActionState } from "@/types"
import { and, avg, desc, eq, gte } from "drizzle-orm"
import { startOfDay, subDays } from "date-fns"
import { stringify } from "csv-stringify" // Corrected import

interface AverageTimes {
  avgWaitSeconds: number
  avgConsultSeconds: number
}

export async function getDailyAverageWaitTimesAction(
  branchId: string
): Promise<ActionState<AverageTimes>> {
  try {
    const todayStart = startOfDay(new Date())

    const [result] = await db
      .select({
        avgWait: avg(consultHistoryTable.waitDurationSeconds),
        avgConsult: avg(consultHistoryTable.consultDurationSeconds)
      })
      .from(consultHistoryTable)
      .where(
        and(
          eq(consultHistoryTable.branchId, branchId),
          gte(consultHistoryTable.createdAt, todayStart)
        )
      )

    return {
      isSuccess: true,
      message: "Daily average times retrieved successfully.",
      data: {
        avgWaitSeconds: result.avgWait
          ? Math.round(parseFloat(result.avgWait))
          : 0,
        avgConsultSeconds: result.avgConsult
          ? Math.round(parseFloat(result.avgConsult))
          : 0
      }
    }
  } catch (error) {
    console.error("Error getting daily average wait times:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve daily average wait times."
    }
  }
}

export async function getConsultHistoryForExportAction(
  branchId: string
): Promise<ActionState<SelectConsultHistory[]>> {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30)

    const history = await db.query.consultHistory.findMany({
      where: and(
        eq(consultHistoryTable.branchId, branchId),
        gte(consultHistoryTable.createdAt, thirtyDaysAgo)
      ),
      orderBy: [desc(consultHistoryTable.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Consultation history for export retrieved successfully.",
      data: history
    }
  } catch (error) {
    console.error("Error getting consultation history for export:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve consultation history for export."
    }
  }
}

/**
 * @function exportConsultHistoryAction
 * @description Fetches consultation history for a branch and converts it to a CSV string.
 * @param {string} branchId - The UUID of the branch.
 * @returns {Promise<ActionState<{ csv: string }>>} The generated CSV content.
 */
export async function exportConsultHistoryAction(
  branchId: string
): Promise<ActionState<{ csv: string }>> {
  const historyResult = await getConsultHistoryForExportAction(branchId)

  if (!historyResult.isSuccess) {
    return historyResult
  }

  if (historyResult.data.length === 0) {
    return { isSuccess: false, message: "No history to export." }
  }

  try {
    const csvString = await new Promise<string>((resolve, reject) => {
      stringify(
        historyResult.data,
        { header: true },
        (err, stringified) => {
          if (err) {
            return reject(err)
          }
          if (stringified) {
            return resolve(stringified)
          }
          return reject(
            new Error("CSV stringification resulted in undefined value.")
          )
        }
      )
    })

    return {
      isSuccess: true,
      message: "CSV content generated successfully.",
      data: { csv: csvString }
    }
  } catch (error) {
    console.error("Error generating CSV string:", error)
    return { isSuccess: false, message: "Failed to generate CSV." }
  }
}
