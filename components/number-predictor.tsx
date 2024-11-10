"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { predictNumber } from "@/lib/number-predictor";
import { NumberInput } from "@/components/number-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NumberPredictor(): JSX.Element {
  const [numbers, setNumbers] = useState<string[]>(Array(15).fill(""));
  const [prediction, setPrediction] = useState<number | null>(null);
  const [actualNumber, setActualNumber] = useState<string>("");
  const [isShifting, setIsShifting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePredict = async (): Promise<void> => {
    if (numbers.every((num) => num !== "")) {
      try {
        setIsLoading(true);

        const predictedNumber = await predictNumber(numbers.map(Number));
        setPrediction(predictedNumber);
      } catch (error) {
        console.error("Prediction failed:", error);
        setModalContent(
          error instanceof Error
            ? error.message
            : "Error making prediction. Please try again.",
        );
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setModalContent("Predictions require all 15 numbers to be filled in.");
      setIsModalOpen(true);
    }
  };

  const handleShift = (): void => {
    if (actualNumber !== "") {
      setIsShifting(true);
      setTimeout(() => {
        setNumbers([...numbers.slice(1), actualNumber]);
        setPrediction(null);
        setActualNumber("");
        setIsShifting(false);
      }, 500); // Delay to allow for animation
    } else {
      setModalContent("Please enter the actual 16th number before shifting.");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Number Predictor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <AnimatePresence>
              {numbers.map((num, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <NumberInput
                    value={num}
                    onChange={(value: number) => {
                      const newNumbers = [...numbers];
                      newNumbers[index] = value.toString();
                      setNumbers(newNumbers);
                    }}
                    placeholder={`#${index + 1}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center mb-6">
            <Button onClick={handlePredict} disabled={isShifting || isLoading}>
              {isLoading ? "Loading Model..." : "Predict Next Number"}
            </Button>
          </div>
          {prediction !== null && (
            <div className="text-center mb-6">
              <Label>Predicted 16th Number:</Label>
              <div className="text-2xl font-bold">{prediction}</div>
            </div>
          )}
          {prediction !== null && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <NumberInput
                value={actualNumber}
                onChange={(value: number) => setActualNumber(value.toString())}
                placeholder="Enter actual 16th number"
              />
              <Button onClick={handleShift} disabled={isShifting}>
                Shift Numbers
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
            <DialogDescription>{modalContent}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
