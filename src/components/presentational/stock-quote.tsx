"use client";

import * as React from "react";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ReferenceLine, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  formatMarketTimeInLocalZone,
  MARKET_CLOSE_MINUTE,
  MARKET_OPEN_MINUTE,
  minutesFromClockTimeLabel,
} from "@/lib/datetime";
import { cn } from "@/lib/utils";

export type Comparison = {
  available: boolean;
  price: number;
  change: number;
  changePercent: number;
};

export type StockQuoteData = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  intraday?: Array<{
    time: string;
    price: number;
    changePercent: number;
  }>;
  comparisons?: Record<string, Comparison>;
};

const comparisonLabels: Record<string, string> = {
  "7d": "7D",
  "30d": "30D",
  ytd: "YTD",
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatComparisonLabel(key: string) {
  return comparisonLabels[key] ?? key.toUpperCase();
}

function comparisonEntries(quote: StockQuoteData) {
  return Object.entries(quote.comparisons ?? {});
}

function formatPrice(value: number, currency: string) {
  if (currency === "USD") {
    return priceFormatter.format(value);
  }

  return `${currency} ${numberFormatter.format(value)}`;
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${percentFormatter.format(value)}%`;
}

function formatUnsignedPercent(value: number) {
  return `${percentFormatter.format(Math.abs(value))}%`;
}

function changeTone(isPositive: boolean) {
  return isPositive
    ? "text-green-700 dark:text-green-400"
    : "text-red-700 dark:text-red-400";
}

function chartColorVar(isPositive: boolean, shade: 500 | 600) {
  const color = isPositive ? "green" : "red";
  return `var(--color-${color}-${shade})`;
}

function chartFillColor(isPositive: boolean, shade: 500 | 600) {
  return `color-mix(in oklab, ${chartColorVar(
    isPositive,
    shade,
  )} 33%, transparent)`;
}

function chartConfig(isPositive: boolean): ChartConfig {
  return {
    price: {
      label: "Price",
      theme: {
        light: chartColorVar(isPositive, 600),
        dark: chartColorVar(isPositive, 500),
      },
    },
    fill: {
      label: "Fill",
      theme: {
        light: chartFillColor(isPositive, 600),
        dark: chartFillColor(isPositive, 500),
      },
    },
    open: {
      label: "Previous close",
      theme: {
        light: "var(--color-zinc-300)",
        dark: "var(--color-zinc-600)",
      },
    },
  };
}

function getStockQuoteChartModel(quote: StockQuoteData) {
  const isPositive = quote.change >= 0;
  const previousClose = quote.price - quote.change;
  const points = (quote.intraday ?? [])
    .map((point) => {
      const sessionMinute = minutesFromClockTimeLabel(point.time);

      return sessionMinute === null
        ? null
        : {
            ...point,
            sessionMinute,
          };
    })
    .filter((point) => point !== null);

  if (points.length === 0) {
    return null;
  }

  const domainValues = [...points.map((point) => point.price), previousClose];

  return {
    isPositive,
    previousClose,
    points,
    domainMin: Math.min(...domainValues),
    domainMax: Math.max(...domainValues),
  };
}

function StockQuotePriceChart({
  quote,
  className,
  showTooltip = true,
}: {
  quote: StockQuoteData;
  className?: string;
  showTooltip?: boolean;
}) {
  const chartModel = getStockQuoteChartModel(quote);
  const gradientId = React.useId().replace(/:/g, "");

  if (!chartModel) {
    return null;
  }

  return (
    <ChartContainer
      config={chartConfig(chartModel.isPositive)}
      className={cn("aspect-auto w-full", className)}
    >
      <AreaChart
        data={chartModel.points}
        margin={{ left: 0, right: 0, top: 4, bottom: 4 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-fill)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--color-fill)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="sessionMinute"
          domain={[MARKET_OPEN_MINUTE, MARKET_CLOSE_MINUTE]}
          hide
          type="number"
        />
        <YAxis hide domain={[chartModel.domainMin, chartModel.domainMax]} />
        <ReferenceLine
          stroke="var(--color-open)"
          strokeDasharray="4 4"
          y={chartModel.previousClose}
        />
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                labelClassName="tabular-nums"
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.time
                    ? formatMarketTimeInLocalZone(payload[0].payload.time)
                    : ""
                }
                formatter={(value, _name, item, index) =>
                  index === 0 && (
                    <div className="grid w-full gap-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatPrice(Number(value), quote.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Change</span>
                        <span
                          className={cn(
                            "font-mono font-medium tabular-nums",
                            changeTone(
                              Number(item.payload?.changePercent ?? 0) >= 0,
                            ),
                          )}
                        >
                          {formatSignedPercent(
                            Number(item.payload?.changePercent ?? 0),
                          )}
                        </span>
                      </div>
                    </div>
                  )
                }
              />
            }
          />
        )}
        <Area
          dataKey="price"
          fill={`url(#${gradientId})`}
          stroke="var(--color-price)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          type="linear"
        />
      </AreaChart>
    </ChartContainer>
  );
}

function StockQuoteFooter({ quote }: { quote: StockQuoteData }) {
  const comparisonStats = comparisonEntries(quote).slice(0, 3);

  if (comparisonStats.length === 0) {
    return null;
  }

  return (
    <CardFooter className="p-4">
      <div
        className="grid w-full gap-2"
        style={{
          gridTemplateColumns: `repeat(${comparisonStats.length}, minmax(0, 1fr))`,
        }}
      >
        {comparisonStats.map(([key, comparison]) => (
          <div
            key={key}
            className="flex min-w-0 flex-col items-center text-center"
          >
            <p className="text-2xs font-medium text-muted-foreground uppercase">
              {formatComparisonLabel(key)}
            </p>
            <div
              className={cn(
                "mt-1 flex items-center justify-center gap-0.5 text-xs font-semibold",
                changeTone(comparison.change >= 0),
              )}
            >
              {comparison.change >= 0 ? (
                <ArrowUpRight className="size-[1.25em]" />
              ) : (
                <ArrowDownRight className="size-[1.25em]" />
              )}
              <span>{formatUnsignedPercent(comparison.changePercent)}</span>
            </div>
          </div>
        ))}
      </div>
    </CardFooter>
  );
}

function StockQuoteSymbol({ symbol }: { symbol: string }) {
  return (
    <div className="-mx-2 -my-1 rounded-sm bg-card/50 px-2 py-1 backdrop-blur-[1px]">
      <p className="font-heading text-xl leading-none font-semibold tracking-tight">
        {symbol}
      </p>
    </div>
  );
}

function StockQuoteChangeBadge({
  changePercent,
  isPositive,
  showIcon = true,
}: {
  changePercent: number;
  isPositive: boolean;
  showIcon?: boolean;
}) {
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Badge
      className={cn(
        "justify-center gap-0.5 rounded-sm px-1 text-sm font-semibold text-background",
        isPositive
          ? "bg-green-600 dark:bg-green-500"
          : "bg-red-600 dark:bg-red-500",
      )}
    >
      {showIcon && <TrendIcon className="size-[1.25em]!" />}
      {formatUnsignedPercent(changePercent)}
    </Badge>
  );
}

function StockQuoteListCard({
  quote,
  className,
}: {
  quote: StockQuoteData;
  className?: string;
}) {
  const isPositive = quote.change >= 0;
  const hasIntraday = (quote.intraday?.length ?? 0) > 0;

  return (
    <Card className={cn("gap-0 p-0", className)}>
      {hasIntraday ? (
        <CardContent className="relative p-0">
          <StockQuotePriceChart quote={quote} className="h-44" />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-4">
            <StockQuoteSymbol symbol={quote.symbol} />
            <StockQuoteChangeBadge
              changePercent={quote.changePercent}
              isPositive={isPositive}
            />
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex items-start justify-between px-4 pt-4">
          <StockQuoteSymbol symbol={quote.symbol} />
          <StockQuoteChangeBadge
            changePercent={quote.changePercent}
            isPositive={isPositive}
          />
        </CardContent>
      )}
      <StockQuoteFooter quote={quote} />
    </Card>
  );
}

export function StockQuoteCompactList({
  quotes,
}: {
  quotes: StockQuoteData[];
}) {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="divide-y p-0">
        {quotes.map((quote) => {
          const isPositive = quote.change >= 0;
          const hasIntraday = (quote.intraday?.length ?? 0) > 0;

          return (
            <div key={quote.symbol} className="flex gap-3 p-3">
              <div
                className={cn(
                  "flex grow gap-2 justify-between",
                  hasIntraday
                    ? "flex-col items-start"
                    : "flex-row items-center",
                )}
              >
                <StockQuoteSymbol symbol={quote.symbol} />
                <StockQuoteChangeBadge
                  changePercent={quote.changePercent}
                  isPositive={isPositive}
                  showIcon={false}
                />
              </div>

              {hasIntraday ? (
                <StockQuotePriceChart quote={quote} showTooltip={false} />
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function StockQuoteList({
  quotes,
  className,
}: {
  quotes: StockQuoteData[];
  className?: string;
}) {
  const widthConstraints = "min-w-55 max-w-80";
  if (quotes.length === 1) {
    return (
      <div className={cn(widthConstraints, className)}>
        <StockQuoteListCard quote={quotes[0]} />
      </div>
    );
  }

  const wheelGestures = React.useMemo(
    () => [WheelGesturesPlugin({ forceWheelAxis: "x" })],
    [],
  );

  return (
    <Carousel
      opts={{
        align: "center",
        skipSnaps: true,
        loop: true,
        slidesToScroll: "auto",
      }}
      plugins={wheelGestures}
      className={cn("-mx-2", className)}
    >
      <CarouselContent className="ml-0 py-2">
        {quotes.map((quote) => (
          <CarouselItem
            key={quote.symbol}
            className={cn("basis-65 px-2 grow", widthConstraints)}
          >
            <StockQuoteListCard quote={quote} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
