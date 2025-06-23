"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MarketplaceFilters() {
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]

  const conditions = ["New with tags", "Like new", "Good", "Fair"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Type</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="donation" />
                <label htmlFor="donation" className="text-sm">
                  Free (Donation)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sale" />
                <label htmlFor="sale" className="text-sm">
                  For Sale
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={5} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category))
                      }
                    }}
                  />
                  <label htmlFor={category} className="text-sm">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Condition</h4>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedConditions([...selectedConditions, condition])
                      } else {
                        setSelectedConditions(selectedConditions.filter((c) => c !== condition))
                      }
                    }}
                  />
                  <label htmlFor={condition} className="text-sm">
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">Apply Filters</Button>
        </CardContent>
      </Card>

      {(selectedCategories.length > 0 || selectedConditions.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
              {selectedConditions.map((condition) => (
                <Badge key={condition} variant="secondary">
                  {condition}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
