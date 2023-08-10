/* eslint-disable react/prop-types */

export default function SponsorshipCard({ publicImgURL }) {
    return (
        <>
            <div className="content-cards">
                <div className="sponsored-title-sec">
                    <h4>Sponsored</h4>
                    <span>Create Ad</span>
                </div>
                <img src={`${publicImgURL}info4.jpeg`} alt="Test Ad" className="sponsored-visuals" />
                <div className="ad-owner-dtls">
                    <span><b>MikaCosmetics</b></span>
                    <a href="/"><span>mikacosmetics.com</span></a>
                </div>
                <span className="ad-des">
                    Your Pathway to stunning and immaculate beauty and made
                    sure your skin is exfoliating and shining like light.
                </span>
            </div>
        </>
    )
}