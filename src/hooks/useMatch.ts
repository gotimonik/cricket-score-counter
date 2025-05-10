"use client"

import { useState, useEffect } from "react"
import type { BallEvent, Match } from "../types/cricket"
import { MatchService } from "../services/MatchService"

export const useMatch = (matchId?: string) => {
  const [match, setMatch] = useState<Match | null>(null)

  useEffect(() => {
    if (matchId) {
      const loadedMatch = MatchService.getMatch(matchId)
      if (loadedMatch) {
        setMatch(loadedMatch)
      }
    } else {
      // Create a default match for demo purposes
      setMatch({
        id: "demo",
        team1: "Team A",
        team2: "Team B",
        score: 16,
        wickets: 2,
        overs: 0.6,
        events: [
          { type: "run", value: 1 },
          { type: "run", value: 6 },
          { type: "run", value: 2 },
          { type: "wide", value: 0 },
          { type: "wicket", value: 0 },
          { type: "run", value: 6 },
          { type: "wicket", value: 0 },
        ],
      })
    }
  }, [matchId])

  const addEvent = (type: BallEvent["type"], value: number) => {
    if (!match) return

    const newEvent: BallEvent = { type, value }
    let newScore = match.score
    let newWickets = match.wickets
    let newOvers = match.overs

    // Update score
    if (type === "run" || type === "wide" || type === "no-ball") {
      newScore += value
    }

    // Update wickets
    if (type === "wicket") {
      newWickets += 1
    }

    // Update overs (simplified)
    if (type !== "wide" && type !== "no-ball") {
      const currentBalls = Math.floor(newOvers) * 6 + Math.round((newOvers % 1) * 10)
      const newBalls = currentBalls + 1
      newOvers = Math.floor(newBalls / 6) + (newBalls % 6) / 10
    }

    const updatedMatch: Match = {
      ...match,
      score: newScore,
      wickets: newWickets,
      overs: newOvers,
      events: [newEvent, ...match.events],
    }

    setMatch(updatedMatch)

    // Save to storage if it's a real match
    if (match.id !== "demo") {
      MatchService.saveMatch(updatedMatch)
    }
  }

  const undoLastEvent = () => {
    if (!match || match.events.length === 0) return

    const lastEvent = match.events[0]
    let newScore = match.score
    let newWickets = match.wickets
    let newOvers = match.overs

    // Revert score
    if (lastEvent.type === "run" || lastEvent.type === "wide" || lastEvent.type === "no-ball") {
      newScore -= lastEvent.value
    }

    // Revert wickets
    if (lastEvent.type === "wicket") {
      newWickets -= 1
    }

    // Revert overs (simplified)
    if (lastEvent.type !== "wide" && lastEvent.type !== "no-ball") {
      const currentBalls = Math.floor(newOvers) * 6 + Math.round((newOvers % 1) * 10)
      const newBalls = currentBalls - 1
      newOvers = Math.floor(newBalls / 6) + (newBalls % 6) / 10
      newOvers = newOvers >= 0 ? newOvers : 0
    }

    const updatedMatch: Match = {
      ...match,
      score: newScore,
      wickets: newWickets,
      overs: newOvers,
      events: match.events.slice(1),
    }

    setMatch(updatedMatch)

    // Save to storage if it's a real match
    if (match.id !== "demo") {
      MatchService.saveMatch(updatedMatch)
    }
  }

  return {
    match,
    addEvent,
    undoLastEvent,
  }
}
