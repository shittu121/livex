import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const NeedHelp = () => {
  return (
    <div className="mt-auto">
        <Card className="bg-indigo-900 border-indigo-800 fixed bottom-4 left-8">
          <CardContent className=" text-center text-white">
            <h3 className="font-medium">Need help?</h3>
            <p className="text-xs text-indigo-300 mt-1">Check our documentation</p>
            <Button 
              className="mt-3 w-full bg-indigo-700 hover:bg-indigo-800 text-white" 
              size="sm"
            >
              View Docs
            </Button>
          </CardContent>
        </Card>
    </div>
  )
}

export default NeedHelp