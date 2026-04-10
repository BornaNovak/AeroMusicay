import { IME_APLIKACIJE } from "../constants";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Col, Row, Card, Container } from "react-bootstrap";
import { useState, useEffect } from "react";

import PjesmaService from "../services/pjesme/PjesmaService";
import AlbumService from "../services/albumi/AlbumService";
import IzvodacService from "../services/izvodaci/IzvodacService";

export default function Home() {
    const [brojPjesama, setBrojPjesama] = useState(0);
    const [brojAlbuma, setBrojAlbuma] = useState(0);
    const [brojIzvodaca, setBrojIzvodaca] = useState(0);

    const [animatedPjesme, setAnimatedPjesme] = useState(0);
    const [animatedAlbumi, setAnimatedAlbumi] = useState(0);
    const [animatedIzvodaci, setAnimatedIzvodaci] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const pjesmeRezultat = await PjesmaService.get();
            const albumiRezultat = await AlbumService.get();
            const izvodaciRezultat = await IzvodacService.get();
            
            setBrojPjesama(pjesmeRezultat.data.length);
            setBrojAlbuma(albumiRezultat.data.length);
            setBrojIzvodaca(izvodaciRezultat.data.length);
        } catch (error) {
            console.error('Greška pri dohvaćanju statistike:', error);
        }
    }

    useEffect(() => {
        if (animatedPjesme < brojPjesama) {
            const timer = setTimeout(() => {
                setAnimatedPjesme(prev => Math.min(prev + 1, brojPjesama));
            }, 30); 
            return () => clearTimeout(timer);
        }
    }, [animatedPjesme, brojPjesama]);

    useEffect(() => {
        if (animatedAlbumi < brojAlbuma) {
            const timer = setTimeout(() => {
                setAnimatedAlbumi(prev => Math.min(prev + 1, brojAlbuma));
            }, 50); 
            return () => clearTimeout(timer);
        }
    }, [animatedAlbumi, brojAlbuma]);

    useEffect(() => {
        if (animatedIzvodaci < brojIzvodaca) {
            const timer = setTimeout(() => {
                setAnimatedIzvodaci(prev => Math.min(prev + 1, brojIzvodaca));
            }, 40); 
            return () => clearTimeout(timer);
        }
    }, [animatedIzvodaci, brojIzvodaca]);

    return (
        <Container fluid className="p-0">
            <div className="hero-section py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7} className="text-center text-lg-start mb-5 mb-lg-0">
                            <h1 className="display-3 fw-bold mb-5 main-title">
                                Welcome to <span className="text-gradient">{IME_APLIKACIJE}</span>
                            </h1>
                            
                            {/* Povećan Lottie kontejner */}
                            <div className="lottie-container-large">
                                <DotLottieReact
                                    src="/music-group.lottie" 
                                    loop
                                    autoplay
                                />
                            </div>
                        </Col>

                        <Col lg={5}>
                            <div className="stats-wrapper">
                                <Card className="statistikaPanel mb-4 card-pjesme">
                                    <Card.Body className="d-flex align-items-center justify-content-between p-4">
                                        <h4 className="fw-bold text-white mb-0 uppercase-title">Pjesme</h4>
                                        <div className="statistikaTekst">
                                            {animatedPjesme}
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card className="statistikaPanel mb-4 card-albumi">
                                    <Card.Body className="d-flex align-items-center justify-content-between p-4">
                                        <h4 className="fw-bold text-white mb-0 uppercase-title">Albumi</h4>
                                        <div className="statistikaTekst">
                                            {animatedAlbumi}
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card className="statistikaPanel card-izvodaci">
                                    <Card.Body className="d-flex align-items-center justify-content-between p-4">
                                        <h4 className="fw-bold text-white mb-0 uppercase-title">Izvođači</h4>
                                        <div className="statistikaTekst">
                                            {animatedIzvodaci}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Container>
    );
}