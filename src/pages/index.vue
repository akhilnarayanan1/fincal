<template>
    <k-page>
        <k-card raised class="overflow-x-auto" :content-wrap="false">
            <k-table class="min-w-full bg-white">
            <k-table-head class="bg-gray-800">
                <k-table-row header>
                    <k-table-cell class="uppercase font-semibold text-white" header>YEAR</k-table-cell>
                    <k-table-cell class="uppercase font-semibold text-white" header>TOTAL INVESTED</k-table-cell>
                    <k-table-cell class="uppercase font-semibold text-white" header>TOTAL EARNED</k-table-cell>
                    <k-table-cell class="uppercase font-semibold text-white" header>GAIN %</k-table-cell>
                    <k-table-cell class="uppercase font-semibold text-white" header>CAGR %</k-table-cell>
                    <k-table-cell class="uppercase font-semibold text-white" header>XIRR %</k-table-cell>
                </k-table-row>
            </k-table-head>
            <k-table-body>
                <k-table-row v-for="(sip, index) in sips" :class="index%2==0?'bg-gray-100': ''">
                    <k-table-cell>{{ sip.date }}</k-table-cell>
                    <k-table-cell>{{ sip.invested }}</k-table-cell>
                    <k-table-cell>{{ sip.earned }}</k-table-cell>
                    <k-table-cell>{{ sip.gains*100 }}</k-table-cell>
                    <k-table-cell>{{ sip.cagr*100 }}</k-table-cell>
                    <k-table-cell>{{ sip.xirr*100 }}</k-table-cell>
                </k-table-row>
            </k-table-body>
            </k-table>
        </k-card>
    </k-page>
</template>

<script setup lang="ts">

import {
    kPage,
    kList,
    kListInput,
    kListItem,
    kTable,
    kTableHead,
    kTableBody,
    kTableRow,
    kTableCell,
    kBlockTitle,
    kCard,
    Toast
  } from 'konsta/vue';

import { xirr as xirrM } from "node-irr";

interface Investments {
    amount: number;
    date: Date;
}

interface SipParams {
    date: Date;
    invested: any;
    earned: number;
    gains: number;
    cagr: number;
    xirr: number;
    xirrNew: number;
}
  

let sips: SipParams[] = reactive([]);

const interest = 12;

const startDate = new Date(2021, 0, 1);
const endDate = new Date(2021, 11, 31);

const investments: Investments[] = [
       { amount: 1000, date: new Date(2021, 0, 1) },
       { amount: 1000, date: new Date(2021, 1, 1) },
       { amount: 1000, date: new Date(2021, 2, 1) },
       { amount: 1000, date: new Date(2021, 3, 1) },
       { amount: 1000, date: new Date(2021, 4, 1) },
       { amount: 1000, date: new Date(2021, 5, 1) },
       { amount: 1000, date: new Date(2021, 6, 1) },
       { amount: 1000, date: new Date(2021, 7, 1) },
       { amount: 1000, date: new Date(2021, 8, 1) },
       { amount: 1000, date: new Date(2021, 9, 1) },
       { amount: 1000, date: new Date(2021, 10, 1) },
       { amount: 1000, date: new Date(2021, 11, 1) },
    ];

const calcDiffDays = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const sipCalculator = () => {
    const returnsPerDay: Investments[] = [];
    const diffDays = calcDiffDays(startDate, endDate);
    for (let loopDate = startDate; loopDate <= endDate; loopDate.setDate(loopDate.getDate()+1)) {
        const intrestPerDay = interest / diffDays / 100;
        const foundIndex = investments.findIndex((item) => item.date.getTime() === loopDate.getTime());
        const prev : number = returnsPerDay.length == 0 ? 0 : returnsPerDay[returnsPerDay.length - 1].amount;
        if (foundIndex !== -1) { // If found
            returnsPerDay.push({ amount: prev*(1+intrestPerDay) + investments[foundIndex].amount*(1+intrestPerDay), date: new Date(loopDate) });
        } else {
            returnsPerDay.push({ amount: prev*(1+intrestPerDay), date: new Date(loopDate) });
        };
    };
    return returnsPerDay;
};

const xirrCalculator = () => {
    const originalDate = new Date(earnedPerDay[earnedPerDay.length-1].date.getTime());
    const returns: Investments = {
        amount: -earnedPerDay[earnedPerDay.length-1].amount, //12809.328043328941786781301,
        date: new Date(originalDate),
    };
    const updatedInvestments = investments.map((investment) => {
        return {
            amount: investment.amount,
            date: investment.date,
        };
    });
    updatedInvestments.push(returns);
    const { days, rate } = xirrM(updatedInvestments);
    const xirr: Investments[] = [];
    earnedPerDay.map((items, index) => {
        xirr.push({ amount: (items.amount === 0) ? 0 :  days*rate, date: new Date(earnedPerDay[index].date) });
    });
    return xirr;
};


const gainCalculator = () => { 
    let totalInvestment = 0;
    let totalReturn = 0;
    const gains: Investments[]  = [];
    earnedPerDay.map((earnedEach) => {
        totalReturn = earnedEach.amount;
        const foundIndex = investments.findIndex((item) => item.date.getTime() === earnedEach.date.getTime());
        if (foundIndex !== -1) { // If Found
            totalInvestment += investments[foundIndex].amount;
        };
        const gain = ((totalReturn - totalInvestment) / totalInvestment || 0);
        gains.push({ amount: gain, date: new Date(earnedEach.date) });
    });
    return gains;
};

const cagrCalculator = () => {
    let totalInvestment = 0;
    let totalReturn = 0;
    const gains: Investments[]  = [];
    const startDate = earnedPerDay[0].date;
    earnedPerDay.map((earnedEach) => {
        totalReturn = earnedEach.amount;
        const foundIndex = investments.findIndex((item) => item.date.getTime() === earnedEach.date.getTime());
        if (foundIndex !== -1) { // If Found
            totalInvestment += investments[foundIndex].amount;
        };
        const endDate = earnedEach.date;
        const numOfYears = Math.abs(endDate.getFullYear() - startDate.getFullYear()) + 1;
        const cagr = (totalReturn/totalInvestment || 1)**(1/numOfYears) - 1;
        gains.push({ amount: cagr, date: new Date(earnedEach.date) });
    });
    return gains;
};

const investedCalculator = () => {
    const investment: Investments[] = [];
    let totalInvested = 0;
    earnedPerDay.map((earnedEach) => {
        const invested = investments.find((investedPerDay) => earnedEach.date.getTime() === investedPerDay.date.getTime());
        let investedAmount  = invested?.amount || 0;
        let investedDate  = invested?.date || new Date(0);
        if (investedDate.getTime() === earnedEach.date.getTime()) {
            totalInvested += investedAmount;
        };
        investment.push({ amount: totalInvested, date: new Date(earnedEach.date) });
    })
    return investment;
};

const merged = (filter=true) => {
    const mergedStore: SipParams[] = [];
    earnedPerDay.map((earnedEach, i) => {
        const invested = investments.find((investedPerDay) => earnedEach.date.getTime() === investedPerDay.date.getTime());
        let investedAmount  = invested?.amount || 0;
        let investedDate  = invested?.date || new Date(0);
        if (filter && investedDate.getTime() >= earnedEach.date.getTime() || endDate.getTime() === earnedEach.date.getTime()) {
            mergedStore.push({
                date: earnedEach.date,
                invested: investedPerDay[i].amount,
                earned: earnedEach.amount,
                gains: gains[i].amount,
                cagr: cagr[i].amount,
                xirr: xirr[i]?.amount,
            } as SipParams);
        } else if (!filter) {
            mergedStore.push({
                date: earnedEach.date,
                invested: investedPerDay[i].amount,
                earned: earnedEach.amount,
                gains: gains[i].amount,
                cagr: cagr[i].amount,
                xirr: xirr[i]?.amount,
            } as SipParams);
        };
    });
    return mergedStore;
};

const earnedPerDay = sipCalculator();
const investedPerDay = investedCalculator();
const gains = gainCalculator();
const cagr = cagrCalculator();
const xirr = xirrCalculator();

sips = merged();



</script>