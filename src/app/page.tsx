"use client";

import React from "react";
import { useEffect, useState } from 'react';
import { ModeToggle } from "@/components/mode-toggle";
import { HeroSection } from "@/components/sections/hero-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FooterSection from "@/components/sections/footer";
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { fetchSchedule } from '@/pages/api/api'
import { ScheduleItem } from '@/types/apiTypes'
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Flag from 'react-world-flags';
import SubscribeForm from "@/components/sections/subscribe-form";

type Country = {
  name: string;
  flag: string;
  code: string;
};

const countries: Country[] = [
  { name: 'Afghanistan', flag: 'AF', code: 'AFG' },
  { name: 'South Africa', flag: 'ZA', code: 'RSA' },
  { name: 'Germany', flag: 'DE', code: 'GER' },
  { name: 'Argentina', flag: 'AR', code: 'ARG' },
  { name: 'Australia', flag: 'AU', code: 'AUS' },
  { name: 'Brazil', flag: 'BR', code: 'BRA' },
  { name: 'Canada', flag: 'CA', code: 'CAN' },
  { name: 'China', flag: 'CN', code: 'CHN' },
  { name: 'South Korea', flag: 'KR', code: 'KOR' },
  { name: 'United States', flag: 'US', code: 'USA' },
  { name: 'France', flag: 'FR', code: 'FRA' },
  { name: 'Great Britain', flag: 'GB', code: 'GBR' },
  { name: 'India', flag: 'IN', code: 'IND' },
  { name: 'Italy', flag: 'IT', code: 'ITA' },
  { name: 'Japan', flag: 'JP', code: 'JPN' },
  { name: 'Mexico', flag: 'MX', code: 'MEX' },
  { name: 'New Zealand', flag: 'NZ', code: 'NZL' },
  { name: 'Portugal', flag: 'PT', code: 'POR' },
  { name: 'Russia', flag: 'RU', code: 'ROC' },
  { name: 'Ukraine', flag: 'UA', code: 'UKR' },
];

export default function Home() {
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = React.useState("bottom")
  const [selectedCountry, setSelectedCountry] = useState<string>('');



  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!selectedCountry) {

          return;
        }

        const data = await fetchSchedule(selectedCountry);
        console.log('Fetched Data:', data);
        setEvents(data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCountry]); // Dependência em selectedCountry


  const today = new Date().toISOString().split('T')[0];



  const filterEvents = (events: ScheduleItem[]) => {
    return events.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const now = new Date();


      return (startDate <= now && endDate >= now) || endDate < now;
    });
  };

  const filterCompetitors = (events: ScheduleItem[]) => {
    return events.map(event => {
      const competitorsCount = event.competitors.length;

      const competitorsToShow = competitorsCount > 2
        ? event.competitors.filter(competitor => competitor.noc === selectedCountry )
        : event.competitors;

      return {
        ...event,
        competitors: competitorsToShow,
        competitorsCount
      };
    });
  };

  const filteredEvents = filterCompetitors(filterEvents(events));


  if (loading) {
    return <Progress value={50} />;
  }

  const getCountryFlag = (code: string) => {
    const country = countries.find((c) => c.code === code);
    console.log(selectedCountry)
    return country ? <Flag code={country.flag} style={{ height: '16px', width: '24px' }} /> : 'Country';

  };


  return (
    <main className="flex flex-col min-h-screen mx-auto max-w-7xl p-10">
      <div className='mb-2'>
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-white text-black">
              {selectedCountry ? getCountryFlag(selectedCountry) : 'Country'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuSeparator />
            {countries.map((country) => (
              <DropdownMenuItem key={country.code} onSelect={() => setSelectedCountry(country.code)}>
                <Flag code={country.flag} style={{ height: '20px', width: '30px', marginRight: '12px'}} />
                {country.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
      <div className="bg-heroSectionBackground flex-1 flex flex-col items-center justify-center p-6 rounded-lg shadow-lg">

        <HeroSection>
          
          <h1 className="text-black text-xxxl font-bold">OLYMPICS - 2024</h1>
          <p className="mt-12 text-lg font-light text-gray-500">SUBMIT FOR EMAIL NOTIFICATION</p>
          <div className="flex w-full max-w-sm items-center space-x-2 relative z-20">
            <SubscribeForm/>
          </div>
        </HeroSection>
      </div>

      <FooterSection>
        <div className="w-full h-full flex">
          {/* Coluna da esquerda: Redes Sociais */}
          <div className="flex flex-col items-center md:items-start w-1/3 p-4">
            {/*<ModeToggle />*/}
            <p className="text-center md:text-left mb-2 mt-2">Follow us on social media!</p>
            <div className="flex space-x-4 mb-2">
            <a href="https://github.com" className="text-mediaIconSize"><FaGithub /></a>
            <a href="https://linkedin.com" className="text-mediaIconSize"><FaLinkedin /></a>
              <a href="https://instagram.com" className="text-mediaIconSize"><FaInstagram /></a>
            </div>
          </div>

          {/* Coluna do meio: Esportes 
          <div className="flex flex-col items-center w-1/3 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {sports.map((sport, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">{sport.name}</h3>
                  <p className="text-lg font-light">{sport.victories}</p>
                </div>
              ))}
            </div>
          </div>
          */}

          <div className="flex flex-col items-center w-1/3 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          </div>
          </div>

          {/* Coluna da direita: Card de Resultados */}
          <div className="flex flex-col items-center w-1/3 p-4">
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Events</h4>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <div className="text-sm">
                        <h5 className="font-bold">{event.disciplineName}</h5>
                        <p>{event.eventUnitName}</p>
                        <p>{new Date(event.startDate).toLocaleString()}</p>
                        <ul>
                          {event.competitors.map((competitor) => (
                            <li key={competitor.code}>
                              {event.competitors.length > 2 && competitor.noc === selectedCountry
                                ? `${competitor.name} - ${competitor.results.mark}`
                                : event.competitors.length <= 2
                                ? `${competitor.name} - ${competitor.results.mark}`
                                : competitor.name
                              }
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))
                ) : (
                  <p>Select country to see events.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </FooterSection>
      
      <footer className="bg-gray-50 py-4 text-center mt-4">
        <span>Designed and Programmed by : Breno Dameto Silva</span>
      </footer>
    </main>
  );
}
